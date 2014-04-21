describe('Leaf', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )

  describe('constructor', ->
    tests =
      'image':
        html: '<img>'
        text: Quill.Format.EMBED_TEXT
      'break':
        html: '<br>'
        text: ''
      'empty element':
        html: '<b></b>'
        text: ''
      'element':
        html: '<b>Bold</b>'
        text: 'Bold'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        leaf = new Quill.Leaf(@container.firstChild, {})
        expect(leaf.text).toEqual(test.text)
      )
    )
  )

  describe('isLeafNode()', ->
    tests =
      'text node':
        html: 'Test'
        expected: false
      'empty element':
        html: '<b></b>'
        expected: true
      'break':
        html: '<br>'
        expected: true
      'image':
        html: '<img>'
        expected: true
      'element with element child':
        html: '<b><i></i></b>'
        expected: false
      'element with text child':
        html: '<b>Test</b>'
        expected: true

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        expect(Quill.Leaf.isLeafNode(@container.firstChild)).toBe(test.expected)
      )
    )
  )

  describe('deleteText()', ->
    beforeEach( ->
      @container.innerHTML = '<b>Test</b>'
      @leaf = new Quill.Leaf(@container.firstChild, {})
    )

    tests =
      'remove middle':
        expected: '<b>Tt</b>'
        offset: 1, length: 2
      'remove till end':
        expected: '<b>Te</b>'
        offset: 2, length: 2
      'remove all':
        expected: '<b></b>'
        offset: 0, length: 4

    _.each(tests, (test, name) ->
      it(name, ->
        @leaf.deleteText(test.offset, test.length)
        expect.equalHTML(@leaf.node.outerHTML, test.expected)
      )
    )
  )

  describe('insertText()', ->
    tests =
      'element with text node':
        initial:  '<b>Test</b>'
        expected: '<b>Te|st</b>'
        text: 'Test'
      'element without text node':
        initial:  '<b></b>'
        expected: '<b>|</b>'
      'break':
        initial:  '<br>'
        expected: '<span>|</span>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        leaf = new Quill.Leaf(@container.firstChild, {})
        text = test.text or ''
        length = text.length
        expect(leaf.text).toEqual(text)
        expect(leaf.length).toEqual(length)
        leaf.insertText(length/2, '|')
        expect.equalHTML(leaf.node.outerHTML, test.expected)
        expect(leaf.text).toEqual(leaf.node.innerHTML)
        expect(leaf.length).toEqual(length + 1)
      )
    )
  )
)
