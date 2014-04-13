describe('Utils', ->
  beforeEach( ->
    @container = $('#test-container').html('').get(0)
  )

  # describe('findDeepestNode', ->

  # )

  describe('getChildAtOffset', ->
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
  describe('getNodeLength', ->
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

  # describe('partitionChildren', ->

  # )

  it('splitAncestors', ->
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

  # describe('splitChild', ->

  # )

  describe('splitNode', ->
    tests =
      'unnecessary split before':
        initial:  '<b>Bold</b>'
        expected: '<b>Bold</b>'
        offset:   0
      'unnecessary split after':
        initial:  '<b>Bold</b>'
        expected: '<b>Bold</b>'
        offset:   4
      'text node':
        initial:  '<b>Bold</b>'
        expected: '<b>Bo</b><b>ld</b>'
        offset:   2
      'child nodes':
        initial:  '<b><i>Italic</i><s>Strike</s></b>'
        expected: '<b><i>Italic</i></b><b><s>Strike</s></b>'
        offset:   6
      'child and text nodes':
        initial:  '<b><i>Italic</i></b>'
        expected: '<b><i>It</i></b><b><i>alic</i></b>'
        offset:   2
      'split deep nodes':
        initial:  '
          <b><i>
            <s><u>One</u><u>Two</u></s>
            <s>Three</s>
          </i></b>'
        expected: '
          <b><i>
            <s><u>On</u></s>
          </i></b>
          <b><i>
            <s><u>e</u><u>Two</u></s>
            <s>Three</s>
          </i></b>'
        offset:   2

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = Quill.Normalizer.stripWhitespace(test.initial)
        Quill.Utils.splitNode(@container.firstChild, test.offset)
        expect.equalHTML(@container, test.expected)
      )
    )
  )
)
