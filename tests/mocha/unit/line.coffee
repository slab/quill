describe('Line', ->
  beforeEach( ->
    @container = $('#test-container').html('<div></div>').get(0).firstChild
    @doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
  )

  describe('constructor', ->
    tests =
      'no children':
        html: '<div style="text-align: right;"></div>'
        format: { align: 'right' }
        leaves: []
      'empty child':
        html: '<div><b></b></div>'
        leaves: [{ text: '', formats: { bold: true } }]
      'leaf child':
        html: '<div><b>Bold</b></div>'
        leaves: [{ text: 'Bold', formats: { bold: true } }]
      'media child':
        html: '<div><img src="http://quilljs.com/images/icon.png"></div>'
        leaves: [{ text: Quill.Format.MEDIA_TEXT, formats: { image: 'http://quilljs.com/images/icon.png' } }]
      'break child':
        html: '<div><br></div>'
        leaves: [{ text: '', formats: {} }]
      'lots of children':
        html: '<div><b><i>A</i><s>B</s></b><img src="http://quilljs.com/images/icon.png"><u>D</u></div>'
        leaves: [
          { text: 'A', formats: { bold: true, italic: true } }
          { text: 'B', formats: { bold: true, strike: true } }
          { text: Quill.Format.MEDIA_TEXT, formats: { image: 'http://quilljs.com/images/icon.png' } }
          { text: 'D', formats: { underline: true } }
        ]

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        expect(line.node).to.equal(lineNode)
        expect(line.leaves.length).to.equal(test.leaves.length)
        length = _.reduce(test.leaves, (length, leaf) ->
          return length + leaf.text.length
        , 0)
        expect(line.length).to.equal(length)
        leaves = line.leaves.toArray()
        _.each(leaves, (leaf, i) ->
          expect(leaf.text).to.equal(test.leaves[i].text)
          expect(leaf.formats).to.eql(test.leaves[i].formats)
        )
      )
    )
  )

  describe('findLeaf()', ->
    tests =
      'child leaf':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: true, query: 's'
      'leaf parent':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: false, query: 'i'
      'break leaf':
        html: '<br>'
        match: true, query: 'br'
      'no match':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: false, query: $('#expected-container').get(0)
      'line with no leaves':
        html: ''
        match: false, query: $('#expected-container').get(0)

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.html}</div>"
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        queryNode = if _.isString(test.query) then @container.querySelector(test.query) else test.query
        leaf = line.findLeaf(queryNode)
        if test.match
          expect(leaf.node).to.equal(queryNode)
        else
          expect(leaf).to.be(null)
      )
    )
  )

  describe('findLeafAt()', ->
    tests =
      'empty line':
        html: ''
        offset: 0
        expected: [null, 0]
      'beyond empty line':
        html: ''
        offset: 2
        expected: [null, 2]
      'leaf at 0':
        html: '<b>0123</b><i>4567</i>'
        offset: 0
        expected: ['b', 0]
      'leaf in middle of line':
        html: '<b>0123</b><s>4567</s><u>8901</u>'
        offset: 6
        expected: ['s', 2]
      'leaf at boundry':
        html: '<b>0123</b><s>4567</s><u>8901</u>'
        offset: 4
        expected: ['s', 0]
      'leaf with parent':
        html: '<b>0123</b><i><s>4567</s><u>8901</u></i>'
        offset: 6
        expected: ['s', 2]
      'leaf at boundary with parent':
        html: '<b>0123</b><i><s>4567</s><u>8901</u></i>'
        offset: 8
        expected: ['u', 0]
      'beyond line':
        html: '<b>0123</b><i>4567</i>'
        offset: 10
        expected: [null, 2]

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.html}</div>"
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        [leaf, offset] = line.findLeafAt(test.offset)
        if test.expected[0]
          expect(leaf.node).to.equal(lineNode.querySelector(test.expected[0]))
        else
          expect(leaf).to.be(null)
        expect(offset).to.equal(test.expected[1])
      )
    )
  )

  describe('format()', ->
    tests =
      'add text align':
        initial: '<div></div>'
        expected: '<div style="text-align: right;"></div>'
        formats: { align: 'right' }
      'add different text align':
        initial: '<div style="text-align: right;"></div>'
        expected: '<div style="text-align: center;"></div>'
        formats: { align: 'center' }
      'remove text align':
        initial: '<div style="text-align: right;"></div>'
        expected: '<div></div>'
        formats: { align: false }
      'add bold':
        initial: '<div></div>'
        expected: '<div></div>'
        formats: { bold: true }

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        expectedFormats = _.clone(test.formats)
        _.each(test.formats, (value, name) ->
          line.format(name, value)
          delete expectedFormats[name] unless value
        )
        expect(line.formats).to.eql(expectedFormats)
        node = line.node.cloneNode(true)
        Quill.DOM.clearAttributes(node, ['style'])
        expect.equalHTML(node.outerHTML, test.expected)
      )
    )
  )

  describe('deleteText()', ->
    # Need to check html input and output
    # delete entire line
    # delete single node
    # delete part of node
    # delete part of multiple nodes
  )

  describe('formatText()', ->
    # similar to delete
  )

  describe('insertText()', ->
    # insert in middle of two nodes
    # insert in middle of node
    # insert in middle of node with children
    # insert in middle of node but can just adjust text
    # insert into empty line
  )
)
