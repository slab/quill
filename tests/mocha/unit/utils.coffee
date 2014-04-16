describe('Utils', ->
  beforeEach( ->
    @container = $('#test-container').html('').get(0)
  )

  # TODO no tests for traversing multiple line nodes
  describe('findDeepestNode()', ->
    tests =
      'zeroth':
        html: '<div><b>0123</b></div>'
        index: 0, offset: 0
      'first child':
        html: '<div><b>0123</b></div>'
        index: 2, offset: 2
      'middle child':
        html: '<div>01<br><span>23<b>45</b></div>'
        index: 5, offset: 1
      'last child':
        html: '<div>01<br><b>23</b></div>'
        index: 3, offset: 1
      'beyond end of document':
        html: '<div><b>01</b></div>'
        index: 4, offset: 2
    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        [node, offset] = Quill.Utils.findDeepestNode(@container.firstChild, test.index)
        expect(node).to.equal(@container.querySelector('b').firstChild)
        expect(offset).to.equal(test.offset)
      )
    )
  )

  describe('getChildAtOffset()', ->
    beforeEach( ->
      @container.innerHTML = Quill.Normalizer.stripWhitespace('
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

    _.each(tests, (test, name) ->
      [offset, nodeIndex] = test
      it(name, ->
        [child, childOffset] = Quill.Utils.getChildAtOffset(@container, offset)
        expect(child).to.equal(@container.childNodes[nodeIndex])
        expectedOffset = if offset < length then offset%3 else 3
        expect(childOffset).to.equal(expectedOffset)
      )
    )
  )

  # TODO no tests for line node
  describe('getNodeLength()', ->
    tests =
      'element':
        html: '<span>One</span>'
        length: 3
      'text':
        html: 'One'
        length: 3
      'many nodes':
        html: '<span><b><i>A</i>B<u>C<s>D</s></u></span>'
        length: 4
      'ignore break':
        html: '<span><span>A<br></span><br><span>B</span></span>'
        length: 2

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        length = Quill.Utils.getNodeLength(@container.firstChild)
        expect(length).to.equal(test.length)
      )
    )
  )

  describe('partitionChildren()', ->
    tests =
      'multiple splits':
        initial:  '<div><span>01</span><b>23</b></div>'
        expected: '<div><span>0</span><span>1</span><b>2</b><b>3</b></div>'
        offset: 1, length: 2, start: '1', end: '2'

      'enclose':
        initial:  '<div><b>01</b><i>23</i><u>45</u><s>67</s></div>'
        expected: '<div><b>01</b><i>23</i><u>45</u><s>67</s></div>'
        offset: 2, length: 4, start: '23', end: '45'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        [start, end] = Quill.Utils.partitionChildren(@container.firstChild, test.offset, test.length)
        expect.equalHTML(@container, test.expected)
        expect(Quill.DOM.getText(start)).to.equal(test.start)
        expect(Quill.DOM.getText(end)).to.equal(test.end)
      )
    )
  )

  it('splitAncestors()', ->
    @container.innerHTML = Quill.Normalizer.stripWhitespace('
      <div>
        <div>
          <div>One</div>
          <div>Two</div>
        </div>
        <div>
          <div>Three</div>
          <span>Four</span>
          <div>Five</div>
        </div>
      </div>'
    )
    node = @container.querySelector('span')
    Quill.Utils.splitAncestors(node, @container.firstChild)
    expect.equalHTML(@container, '
      <div>
        <div>
          <div>One</div>
          <div>Two</div>
        </div>
        <div>
          <div>Three</div>
        </div>
      </div>
      <div>
        <div>
          <span>Four</span>
          <div>Five</div>
        </div>
      </div>'
    )
  )

  describe('splitChild()', ->
    tests =
      'split middle':
        initial:  '<div><b>01</b><i>23</i></div>'
        expected: '<dib><b>0</b><b>1</b><i>23</i></div>'
        offset: 1, left: '0', right: '1', split: true
      'no split':
        initial:  '<div><b>01</b><i>23</i></div>'
        expected: '<div><b>01</b><i>23</i></div>'
        offset: 2, left: '01', right: '23', split: false
    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        [left, right, split] = Quill.Utils.splitChild(@container.firstChild, test.offset)
        expect(Quill.DOM.getText(left)).to.equal(test.left)
        expect(Quill.DOM.getText(right)).to.equal(test.right)
        expect(test.split).to.equal(split)
      )
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

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = Quill.Normalizer.stripWhitespace(test.initial)
        [left, right, split] = Quill.Utils.splitNode(@container.firstChild, test.offset, test.force)
        expect.equalHTML(@container, test.expected)
        leftText = if left then Quill.DOM.getText(left) else null
        rightText = if right then Quill.DOM.getText(right) else null
        expect(leftText).to.equal(test.left)
        expect(rightText).to.equal(test.right)
        expect(test.split).to.equal(split)
      )
    )
  )
)
