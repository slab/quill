describe('Utils', ->
  beforeEach( ->
    @container = $('#test-container').html('').get(0)
  )

  # describe('findDeepestNode', ->

  # )

  # describe('getChildAtOffset', ->

  # )

  # describe('getNodeLength', ->

  # )

  # describe('partitionChildren', ->

  # )

  describe('splitAncestors', ->
    it('normal', ->
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
  )

  describe('splitChild', ->
  )

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
