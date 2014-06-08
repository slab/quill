describe('Utils', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )

  describe('convertFontSize()', ->
    it('size to pixel', ->
      expect(Quill.Utils.convertFontSize(2)).toEqual('13px')
    )

    it('pixel to size', ->
      expect(Quill.Utils.convertFontSize('16px')).toEqual(3)
    )

    it('approx pixel to size', ->
      expect(Quill.Utils.convertFontSize('19px')).toEqual(5)
    )

    it('smaller than smallest', ->
      expect(Quill.Utils.convertFontSize(0)).toEqual('10px')
    )

    it('larger than largest', ->
      expect(Quill.Utils.convertFontSize('52px')).toEqual(7)
    )
  )

  describe('getChildAtOffset()', ->
    beforeEach( ->
      @container.innerHTML = Quill.Normalizer.stripWhitespace('
        <span>111</span>
        <b>222</b>
        <br>
        <p>
          <span>3</span>
          <s>3</s>
          <span>3</span>
        </p>
        <i>444</i>'
      )
    )

    length = 12
    tests =
      'first child': [2, 0]
      'last child': [10, 4]
      '0': [0, 0]
      'beyond node length': [16, 4]
      'child with children': [8, 3]

    _.each(tests, (test, name) ->
      [offset, nodeIndex] = test
      it(name, ->
        [child, childOffset] = Quill.Utils.getChildAtOffset(@container, offset)
        expect(child).toEqual(@container.childNodes[nodeIndex])
        expectedOffset = if offset < length then offset%3 else 3
        expect(childOffset).toEqual(expectedOffset)
      )
    )
  )

  describe('getNextLineNode()', ->
    it('iterate over standard lines', ->
      container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
        <p id="line-1">Test</p>
        <p id="line-2"><br></p>
        <p id="line-3">Test</p>'
      )).get(0)
      lineNode = container.firstChild
      _.each([1..3], (i) ->
        idIndex = parseInt(lineNode.id.slice('line-'.length))
        expect(idIndex).toEqual(i)
        lineNode = Quill.Utils.getNextLineNode(lineNode, container)
      )
      expect(lineNode).toEqual(null)
    )

    it('iterate over lists', ->
      container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
        <p id="line-1">Test</p>
        <ul>
          <li id="line-2">One</li>
          <li id="line-3">Two</li>
        </ul>
        <ol>
          <li id="line-4">One</li>
          <li id="line-5">Two</li>
        </ol>'
      )).get(0)
      lineNode = container.firstChild
      _.each([1..5], (i) ->
        idIndex = parseInt(lineNode.id.slice('line-'.length))
        expect(idIndex).toEqual(i)
        lineNode = Quill.Utils.getNextLineNode(lineNode, container)
      )
      expect(lineNode).toEqual(null)
    )

    it('iterate with change', ->
      container = $('#editor-container').html('<div id="line-1">One</div><p id="line-2">Two</p>').get(0)
      lineNode = container.firstChild
      expect(lineNode.id).toEqual('line-1')
      Quill.DOM.switchTag(container.lastChild, 'div')
      lineNode = Quill.Utils.getNextLineNode(lineNode, container)
      expect(lineNode).not.toEqual(null)
      expect(lineNode.id).toEqual('line-2')
    )
  )

  describe('getNodeLength()', ->
    tests =
      'element':
        html: '<b>One</b>'
        length: 3
      'text':
        html: 'One'
        length: 3
      'many nodes':
        html: '<i><b><i>A</i>B<u>C<s>D</s></u></i>'
        length: 4
      'ignore break':
        html: '<b><i>A<br></i><br><s>B</s></b>'
        length: 2
      'embed node':
        html: '<img>'
        length: 1
      'include embed':
        html: '<b>Test<img>Test</b>'
        length: 9

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        length = Quill.Utils.getNodeLength(@container.firstChild)
        expect(length).toEqual(test.length)
      )
    )
  )

  describe('mergeNodes()', ->
    it('merge nodes', ->
      @container.innerHTML = '<ul><li>One</li></ul><ul><li>Two</li></ul>'
      Quill.Utils.mergeNodes(@container.firstChild, @container.lastChild)
      expect(@container).toEqualHTML('<ul><li>One</li><li>Two</li></ul>')
    )

    it('merge and normalize', ->
      @container.innerHTML = '<span>One</span><span>Two</span>'
      expect(@container.childNodes.length).toEqual(2)
      Quill.Utils.mergeNodes(@container.firstChild, @container.lastChild)
      expect(@container).toEqualHTML('<span>OneTwo</span>')
      expect(@container.childNodes.length).toEqual(1)
      expect(@container.firstChild.childNodes.length).toEqual(1)
    )

    it('merge text nodes', ->
      @container.innerHTML = ''
      @container.appendChild(document.createTextNode('One'))
      @container.appendChild(document.createTextNode('Two'))
      expect(@container.childNodes.length).toEqual(2)
      Quill.Utils.mergeNodes(@container.firstChild, @container.lastChild)
      expect(@container).toEqualHTML('OneTwo')
      expect(@container.childNodes.length).toEqual(1)
    )
  )

  describe('splitAncestors()', ->
    beforeEach( ->
      @container.innerHTML = Quill.Normalizer.stripWhitespace('
        <div>
          <span>One</span>
          <b>Two</b>
          <div>
            <i>Three</i>
            <s>Four</s>
            <u>Five</u>
          </div>
        </div>
      ')
    )

    it('single split', ->
      node = @container.querySelector('b')
      retNode = Quill.Utils.splitAncestors(node, @container)
      expect(@container).toEqualHTML('
        <div>
          <span>One</span>
        </div>
        <div>
          <b>Two</b>
          <div>
            <i>Three</i>
            <s>Four</s>
            <u>Five</u>
          </div>
        </div>
      ')
      expect(retNode).toEqual(@container.lastChild)
    )

    it('split multiple', ->
      node = @container.querySelector('s')
      retNode = Quill.Utils.splitAncestors(node, @container)
      expect(@container).toEqualHTML('
        <div>
          <span>One</span>
          <b>Two</b>
          <div>
            <i>Three</i>
          </div>
        </div>
        <div>
          <div>
            <s>Four</s>
            <u>Five</u>
          </div>
        </div>
      ')
      expect(retNode).toEqual(@container.lastChild)
    )

    it('split none', ->
      node = @container.querySelector('span')
      html = @container.innerHTML
      retNode = Quill.Utils.splitAncestors(node, @container)
      expect(@container).toEqualHTML(html)
      expect(retNode).toEqual(@container.firstChild)
    )

    it('split parent', ->
      node = @container.querySelector('i')
      html = @container.innerHTML
      retNode = Quill.Utils.splitAncestors(node, @container)
      expect(@container).toEqualHTML('
        <div>
          <span>One</span>
          <b>Two</b>
        </div>
        <div>
          <div>
            <i>Three</i>
            <s>Four</s>
            <u>Five</u>
          </div>
        </div>
      ')
      expect(retNode).toEqual(@container.lastChild)
    )

    it('split force', ->
      node = @container.querySelector('span')
      retNode = Quill.Utils.splitAncestors(node, @container, true)
      expect(@container).toEqualHTML('
        <div>
        </div>
        <div>
          <span>One</span>
          <b>Two</b>
          <div>
            <i>Three</i>
            <s>Four</s>
            <u>Five</u>
          </div>
        </div>
      ')
      expect(retNode).toEqual(node.parentNode)
    )
  )

  describe('splitNode()', ->
    tests =
      'unnecessary split before':
        initial:  '<b>Bold</b>'
        expected: '<b>Bold</b>'
        offset: 0, left: null, right: 'Bold', split: false
      'unnecessary split after':
        initial:  '<b>Bold</b>'
        expected: '<b>Bold</b>'
        offset: 4, left: 'Bold', right: null, split: false
      'text node':
        initial:  '<b>Bold</b>'
        expected: '<b>Bo</b><b>ld</b>'
        offset: 2, left: 'Bo', right: 'ld', split: true
      'child nodes':
        initial:  '<b><i>Italic</i><s>Strike</s></b>'
        expected: '<b><i>Italic</i></b><b><s>Strike</s></b>'
        offset: 6, left: 'Italic', right: 'Strike', split: true
      'child and text nodes':
        initial:  '<b><i>Italic</i></b>'
        expected: '<b><i>It</i></b><b><i>alic</i></b>'
        offset: 2, left: 'It', right: 'alic', split: true
      'split deep nodes':
        initial:  '
          <b>
            <i>
              <s>
                <u>One</u>
                <u>Two</u>
              </s>
              <s>Three</s>
            </i>
          </b>'
        expected: '
          <b>
            <i>
              <s>
                <u>On</u>
              </s>
            </i>
          </b>
          <b>
            <i>
              <s>
                <u>e</u>
                <u>Two</u>
              </s>
              <s>Three</s>
            </i>
          </b>'
        offset: 2, left: 'On', right: 'eTwoThree', split: true
      'force split':
        initial:  '<b>Bold</b>'
        expected: '<b>Bold</b><b></b>'
        offset: 4, left: 'Bold', right: '', split: true, force: true
      'split image':
        initial:  '<img src="http://quilljs.com/images/cloud.png">'
        expected: '<img src="http://quilljs.com/images/cloud.png">'
        offset: 1, left: '!', right: null, split: false

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = Quill.Normalizer.stripWhitespace(test.initial)
        [left, right, split] = Quill.Utils.splitNode(@container.firstChild, test.offset, test.force)
        expect(@container).toEqualHTML(test.expected)
        leftText = if left then Quill.DOM.getText(left) else null
        rightText = if right then Quill.DOM.getText(right) else null
        expect(leftText).toEqual(test.left)
        expect(rightText).toEqual(test.right)
        expect(test.split).toEqual(split)
      )
    )
  )
)
