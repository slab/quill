describe('Line', ->
  beforeEach( ->
    @container = $('#test-container').html('<div></div>').get(0).firstChild
    @doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
  )

  describe('buildLeaves()', ->
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

  describe('deleteText()', ->
    # Need to check html input and output
    # delete entire line
    # delete single node
    # delete part of node
    # delete part of multiple nodes
  )

  describe('findLeaf()', ->
    # Relies on build leaf but then get one
    # find normal leaf
    # do not find node that is a child but not a leaf
    # find break leaf
    # no match
    # line has no leaves
  )

  describe('findLeafAt()', ->
    # find leaf at boundaries (start and end and beyond end)
      # for normal line and empty line
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
        Quill.DOM.clearAttributes(line.node, ['style'])
        expect.equalHTML(line.node.outerHTML, test.expected)
      )
    )
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
