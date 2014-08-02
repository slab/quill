dom = Quill.Lib.DOM

describe('DOM', ->
  beforeEach( ->
    @container = $('#editor-container').html('<div></div>').get(0).firstChild
  )

  describe('classes', ->
    afterEach( ->
      $(@container).removeClass()
    )

    it('addClass()', ->
      dom(@container).addClass('custom')
      expect($(@container).hasClass('custom')).toBe(true)
    )

    it('addClass() existing', ->
      dom(@container).addClass('custom')
      dom(@container).addClass('custom')
      expect($(@container).attr('class')).toEqual('custom')
    )

    it('get classes', ->
      $(@container).addClass('custom')
      $(@container).addClass('another')
      classes = dom(@container).classes().sort()
      expect(classes.length).toEqual(2)
      expect(classes[0]).toEqual('another')
      expect(classes[1]).toEqual('custom')
    )

    it('hasClass()', ->
      $(@container).addClass('custom')
      expect(dom(@container).hasClass('custom')).toBe(true)
    )

    it('removeClass()', ->
      $(@container).addClass('custom')
      dom(@container).removeClass('custom')
      expect($(@container).hasClass('custom')).toBe(false)
    )

    it('removeClass() nonexistent', ->
      dom(@container).removeClass('custom')
      expect(@container.outerHTML).toEqualHTML('<div></div>')
    )

    it('toggleClass()', ->
      dom(@container).toggleClass('custom')
      expect($(@container).hasClass('custom')).toBe(true)
      dom(@container).toggleClass('custom')
      expect($(@container).hasClass('custom')).toBe(false)
    )
  )

  describe('attributes', ->
    beforeEach( ->
      $(@container).html('<div class="custom" style="color: red;"></div>')
      @node = @container.firstChild
    )

    it('get attributes none', ->
      $(@container).html('<div></div>')
      attributes = dom(@container.firstChild).attributes()
      expect(_.keys(attributes).length).toEqual(0)
    )

    it('get attributes multiple', ->
      attributes = dom(@node).attributes()
      expect(_.keys(attributes).length).toEqual(2)
      expect(attributes['class']).toEqual('custom')
      expect(attributes['style'].toLowerCase()).toContain('color: red')
    )

    it('set attributes', ->
      attributes =
        'class': 'test'
        'style': 'font-size: 13px;'
      dom(@node).attributes(attributes)
      expect(dom(@node).attributes()).toEqual(attributes)
    )
  )

  describe('styles', ->
    html = '<span style="color: red; display: inline;">Test</span>'
    styles =
      'color': 'red'
      'display': 'inline'

    it('get styles', ->
      $(@container).html(html)
      result = dom(@container.firstChild).styles()
      expect(result).toEqual(styles)
    )

    it('set styles', ->
      $(@container).html('<span style="cursor: pointer;">Test</span>')
      dom(@container.firstChild).styles(styles, true)
      _.each(styles, (value, name) =>
        expect(@container.firstChild.style[name]).toEqual(value)
      )
      expect(@container.firstChild.style.pointer).toBeUndefined()
    )

    it('add styles', ->
      $(@container).html(html)
      dom(@container.firstChild).styles(
        color: 'blue'
        cursor: 'pointer'
      )
      expect(@container.firstChild.style.display).toEqual('inline')
      expect(@container.firstChild.style.color).toEqual('blue')
      expect(@container.firstChild.style.cursor).toEqual('pointer')
    )
  )

  describe('events', ->
    describe('on()', ->
      beforeEach( ->
        $(@container).html('<div><button type="button">Button</button></div>')
        @button = @container.querySelector('button')
      )

      it('click', (done) ->
        dom(@button).on('click', _.partial(done, null))
        $(@button).trigger('click')
      )

      it('bubble', (done) ->
        dom(@button.parentNode).on('click', _.partial(done, null))
        $(@button).trigger('click')
      )

      it('prevent bubble', (done) ->
        dom(@button).on('click', ->
          _.defer(done)
          return false
        )
        dom(@button.parentNode).on('click', ->
          throw new Error('Bubble not prevented')
        )
        $(@button).trigger('click')
      )
    )

    describe('trigger()', ->
      it('click', ->
        $(@container).html('<button type="button" onclick="window._triggerClick = true;">Button</button>')
        @button = @container.querySelector('button')
        expect(window._triggerClick).not.toBeTruthy()
        dom(@button).trigger('click')
        expect(window._triggerClick).toBe(true)
        window._triggerClick = undefined
      )

      it('change', (done) ->
        $(@container).html('
          <select>
            <option value="one" selected>One</option>
            <option value="two">Two</option>
          </select>'
        )
        select = @container.querySelector('select')
        # Only testing event handler is fired, actually changing select is tested in select section below
        dom(select).on('change', ->
          expect(select.selectedIndex).toEqual(0)
          done()
        )
        dom(select).trigger('change')
      )

      it('keydown', (done) ->
        $(@container).html('<div contenteditable=true></div>')
        @container.firstChild.focus()
        dom(@container.firstChild).on('keydown', (event) ->
          expect(event.key).toEqual('A')
          expect(event.altKey).not.toBeTruthy()
          expect(event.ctrlKey).not.toBeTruthy()
          expect(event.metaKey).toBeTruthy()
          expect(event.shiftKey).toBeTruthy()
          done()
        )
        dom(@container.firstChild).trigger('keydown', { key: 'A', shiftKey: true, metaKey: true })
      )
    )
  )

  describe('text', ->
    beforeEach( ->
      $(@container).html('0<span>1</span><!-- Comment --><b><i>2</i></b>3<img><br>')
    )

    it('get text from element', ->
      expect(dom(@container).text()).toEqual('0123')
    )

    it('get text from break', ->
      expect(dom(@container.lastChild).text()).toEqual('')
    )

    it('get text from comment', ->
      expect(dom(@container.childNodes[2]).text()).toEqual('')
    )

    it('get text embed tag', ->
      expect(dom(@container.querySelector('img')).text()).toEqual(dom.EMBED_TEXT)
    )

    it('set text on element', ->
      dom(@container).text('test')
      expect($(@container).text()).toEqual('test')
    )

    it('set text on text node', ->
      dom(@container.firstChild).text('A')
      expect($(@container).text()).toEqual('A123')
    )

    it('get text nodes', ->
      textNodes = dom(@container).textNodes()
      expect(textNodes.length).toEqual(4)
    )
  )

  describe('access', ->
    beforeEach( ->
      @container = $('#editor-container').html('').get(0)
    )

    describe('child at offset', ->
      beforeEach( ->
        @container.innerHTML = Quill.Lib.Normalizer.stripWhitespace('
          <span>111</span>
          <b>222</b>
          <br>
          <div>
            <span>3</span>
            <s>3</s>
            <span>3</span>
          </div>
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

      _.each(tests, (test, name) =>
        [offset, nodeIndex] = test
        it(name, ->
          [child, childOffset] = dom(@container).child(offset)
          expect(child).toEqual(@container.childNodes[nodeIndex])
          expectedOffset = if offset < length then offset%3 else 3
          expect(childOffset).toEqual(expectedOffset)
        )
      )
    )

    describe('get node length', ->
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
          length = dom(@container.firstChild).length()
          expect(length).toEqual(test.length)
        )
      )
    )
  )

  describe('manipulation', ->
    beforeEach( ->
      $(@container).html('<div style="cursor: pointer">One</div><div><span>Two</span><b>Bold</b></div>')
    )

    it('moveChildren()', ->
      dom(@container.lastChild).moveChildren(@container.firstChild)
      expect(@container).toEqualHTML('<div style="cursor: pointer">One<span>Two</span><b>Bold</b></div><div></div>')
    )

    it('remove()', ->
      dom(@container.lastChild.firstChild).remove()
      expect(@container).toEqualHTML('<div style="cursor: pointer">One</div><div><b>Bold</b></div>')
    )

    it('switchTag()', ->
      dom(@container.firstChild).switchTag('span')
      expect(@container).toEqualHTML('<span style="cursor: pointer">One</span><div><span>Two</span><b>Bold</b></div>')
    )

    it('switchTag() to same', ->
      html = @container.innerHTML
      expect(@container).toEqualHTML(html)
    )

    it('switchTag() to void', ->
      dom(@container.lastChild).switchTag('br')
      expect(@container).toEqualHTML('<div style="cursor: pointer">One</div><br>')
    )

    it('unwrap()', ->
      dom(@container.lastChild).unwrap()
      expect(@container).toEqualHTML('<div style="cursor: pointer">One</div><span>Two</span><b>Bold</b>')
    )

    it('wrap()', ->
      wrapper = @container.ownerDocument.createElement('div')
      dom(@container.firstChild).wrap(wrapper)
      expect(@container).toEqualHTML('<div><div style="cursor: pointer">One</div></div><div><span>Two</span><b>Bold</b></div>')
    )

    it('wrap() orphan node', ->
      wrapper = @container.ownerDocument.createElement('div')
      node = @container.ownerDocument.createElement('span')
      dom(node).wrap(wrapper)
      expect(wrapper.outerHTML).toEqualHTML('<div><span></span></div>')
    )
  )

  describe('split + merge', ->
    beforeEach( ->
      @container = $('#editor-container').html('').get(0)
    )

    describe('merge', ->
      it('merge nodes', ->
        @container.innerHTML = '<ul><li>One</li></ul><ul><li>Two</li></ul>'
        dom(@container.firstChild).merge(@container.lastChild)
        expect(@container).toEqualHTML('<ul><li>One</li><li>Two</li></ul>')
      )

      it('merge and normalize', ->
        @container.innerHTML = '<span>One</span><span>Two</span>'
        expect(@container.childNodes.length).toEqual(2)
        dom(@container.firstChild).merge(@container.lastChild)
        expect(@container).toEqualHTML('<span>OneTwo</span>')
        expect(@container.childNodes.length).toEqual(1)
        expect(@container.firstChild.childNodes.length).toEqual(1)
      )

      it('merge text nodes', ->
        @container.innerHTML = ''
        @container.appendChild(document.createTextNode('One'))
        @container.appendChild(document.createTextNode('Two'))
        expect(@container.childNodes.length).toEqual(2)
        dom(@container.firstChild).merge(@container.lastChild)
        expect(@container).toEqualHTML('OneTwo')
        expect(@container.childNodes.length).toEqual(1)
      )
    )

    describe('splitAncestors()', ->
      beforeEach( ->
        @container.innerHTML = Quill.Lib.Normalizer.stripWhitespace('
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
        retNode = dom(node).splitAncestors(@container).get()
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
        retNode = dom(node).splitAncestors(@container).get()
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
        retNode = dom(node).splitAncestors(@container).get()
        expect(@container).toEqualHTML(html)
        expect(retNode).toEqual(@container.firstChild)
      )

      it('split parent', ->
        node = @container.querySelector('i')
        html = @container.innerHTML
        retNode = dom(node).splitAncestors(@container).get()
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
        retNode = dom(node).splitAncestors(@container, true).get()
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

    describe('split node', ->
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
          @container.innerHTML = Quill.Lib.Normalizer.stripWhitespace(test.initial)
          [left, right, split] = dom(@container.firstChild).split(test.offset, test.force)
          expect(@container).toEqualHTML(test.expected)
          leftText = if left then dom(left).text() else null
          rightText = if right then dom(right).text() else null
          expect(leftText).toEqual(test.left)
          expect(rightText).toEqual(test.right)
          expect(test.split).toEqual(split)
        )
      )
    )

  )

  describe('select', ->
    beforeEach( ->
      $(@container).html('
        <select>
          <option value="one">One</option>
          <option value="two" selected>Two</option>
          <option value="three">Three</option>
        </select>
      ')
      @select = @container.firstChild
      $(@select).val('one')
    )

    it('default option', ->
      expect(dom(@select).default()).toEqual(@select.children[1])
    )

    it('reset', ->
      expect($(@select).val()).toEqual('one')
      dom(@select).reset()
      expect($(@select).val()).toEqual('two')
    )

    it('option() dom', ->
      dom(@select).option(@select.children[2])
      expect($(@select).val()).toEqual('three')
    )

    it('option() value', ->
      dom(@select).option('three')
      expect($(@select).val()).toEqual('three')
    )

    it('value() option', ->
      dom(@select).option(@select.children[2])
      expect(dom(@select).value()).toEqual('three')
    )

    it('value() value', ->
      dom(@select).option('three')
      expect(dom(@select).value()).toEqual('three')
    )

    it('value() blank', ->
      dom(@select).option('')
      expect(dom(@select).value()).toEqual('')
    )
  )

  describe('get nodes', ->
    it('get child nodes', ->
      @container.innerHTML = '<b>0</b><i>1</i><u>2</u><br>'
      nodes = dom(@container).childNodes()
      expect(nodes.length).toEqual(4)
    )

    it('get descendants', ->
      @container.innerHTML = '<b>0</b><i><span>1</span><s>2</s></i><u>3</u><br>'
      nodes = dom(@container).descendants()
      expect(nodes.length).toEqual(6)
    )
  )

  describe('convertFontSize()', ->
    it('size to pixel', ->
      expect(dom.convertFontSize(2)).toEqual('13px')
    )

    it('pixel to size', ->
      expect(dom.convertFontSize('16px')).toEqual(3)
    )

    it('approx pixel to size', ->
      expect(dom.convertFontSize('19px')).toEqual(5)
    )

    it('smaller than smallest', ->
      expect(dom.convertFontSize(0)).toEqual('10px')
    )

    it('larger than largest', ->
      expect(dom.convertFontSize('52px')).toEqual(7)
    )
  )

  describe('get next line node', ->
    it('iterate over standard lines', ->
      container = $('#editor-container').html(Quill.Lib.Normalizer.stripWhitespace('
        <div id="line-1">Test</div>
        <div id="line-2"><br></div>
        <div id="line-3">Test</div>'
      )).get(0)
      lineNode = container.firstChild
      _.each([1..3], (i) ->
        idIndex = parseInt(lineNode.id.slice('line-'.length))
        expect(idIndex).toEqual(i)
        lineNode = dom(lineNode).nextLineNode(container)
      )
      expect(lineNode).toEqual(null)
    )

    it('iterate over lists', ->
      container = $('#editor-container').html(Quill.Lib.Normalizer.stripWhitespace('
        <div id="line-1">Test</div>
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
        lineNode = dom(lineNode).nextLineNode(container)
      )
      expect(lineNode).toEqual(null)
    )

    it('iterate with change', ->
      container = $('#editor-container').html('<div id="line-1">One</div><div id="line-2">Two</div>').get(0)
      lineNode = container.firstChild
      expect(lineNode.id).toEqual('line-1')
      dom(container.lastChild).switchTag('div')
      lineNode = dom(lineNode).nextLineNode(container)
      expect(lineNode).not.toEqual(null)
      expect(lineNode.id).toEqual('line-2')
    )
  )
)
