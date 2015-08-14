dom = Quill.Lib.DOM

xdescribe('Leaf', ->
  beforeEach( ->
    @container = $('#test-container').html('').get(0)
  )

  describe('constructor', ->
    tests =
      'image':
        html: '<img src="http://quilljs.com/images/cloud.png">'
        text: dom.EMBED_TEXT
      'break':
        html: '<br>'
        text: ''
      'empty element':
        html: '<b></b>'
        text: ''
      'text':
        html: 'Text'
        text: 'Text'

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
        expected: true
      'empty element':
        html: '<b></b>'
        expected: true
      'break':
        html: '<br>'
        expected: true
      'image':
        html: '<img src="http://quilljs.com/images/cloud.png">'
        expected: true
      'element with element child':
        html: '<b><i></i></b>'
        expected: false
      'element with text child':
        html: '<b>Test</b>'
        expected: false

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        expect(Quill.Leaf.isLeafNode(@container.firstChild)).toBe(test.expected)
      )
    )
  )

  describe('deleteText()', ->
    beforeEach( ->
      @container.innerHTML = 'Test'
      @leaf = new Quill.Leaf(@container.firstChild, {})
    )

    tests =
      'remove middle':
        expected: 'Tt'
        offset: 1, length: 2
      'remove till end':
        expected: 'Te'
        offset: 2, length: 2
      'remove all':
        expected: ''
        offset: 0, length: 4

    _.each(tests, (test, name) ->
      it(name, ->
        @leaf.deleteText(test.offset, test.length)
        expect(@leaf.text).toEqualHTML(test.expected)
        expect(dom(@leaf.node).text()).toEqualHTML(test.expected)
      )
    )
  )

  describe('deleteText() with embed tags', ->
    it('removes the embed tag and replaces it with an empty text node', ->
      @container.innerHTML = '<img>'
      leaf = new Quill.Leaf(@container.firstChild, {})

      leaf.deleteText(0, 1)

      expect(leaf.text).toEqualHTML('')
      expect(dom(leaf.node).text()).toEqualHTML('')
    )
  )

  describe('insertText()', ->
    tests =
      'element with text node':
        initial:  'Test'
        expected: 'Te|st'
        text: 'Test'
      'element without text node':
        initial:  '<b></b>'
        expected: '<b>|</b>'
      'break':
        initial:  '<br>'
        expected: '|'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        leaf = new Quill.Leaf(@container.firstChild, {})
        text = test.text or ''
        length = text.length
        expect(leaf.text).toEqual(text)
        expect(leaf.length).toEqual(length)
        leaf.insertText(length/2, '|')
        expect(@container).toEqualHTML(test.expected)
        expect(leaf.text).toEqual(dom(leaf.node).text())
        expect(leaf.length).toEqual(length + 1)
      )
    )
  )
)
