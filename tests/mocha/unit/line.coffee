describe('Line', ->
  beforeEach( ->
    @container = $('#test-container').html('<div></div>').get(0).firstChild
    @doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
    @lineNode = @container.ownerDocument.createElement('div')
    @container.appendChild(@lineNode)
  )

  describe('buildLeaves', ->
    it('no children', ->
      @lineNode.style.textAlign = 'right'
      line = new Quill.Line(@doc, @lineNode)
      expect(line.node).to.equal(@lineNode)
      expect(line.leaves.length).to.equal(0)
      expect(line.length).to.equal(0)
      expect(line.formats).to.eql({ align: 'right' })
    )

    it('single leaf child', ->
      @lineNode.innerHTML = '<b>Bold</b>'
      line = new Quill.Line(@doc, @lineNode)
      expect(line.node).to.equal(@lineNode)
      expect(line.length).to.equal(4)
      expect(line.leaves.length).to.equal(1)
      expect(line.leaves.first.formats).to.eql({ bold: true })
      expect(line.leaves.first.text).to.equal('Bold')
    )

    it('single media child', ->
      @lineNode.innerHTML = '<img src="http://quilljs.com/images/icon.png">'
      line = new Quill.Line(@doc, @lineNode)
      expect(line.node).to.equal(@lineNode)
      expect(line.length).to.equal(1)
      expect(line.leaves.length).to.equal(1)
      expect(line.leaves.first.formats).to.eql({ image: 'http://quilljs.com/images/icon.png' })
      expect(line.leaves.first.text).to.equal(Quill.Format.MEDIA_TEXT)
    )

    it('single break child', ->
      @lineNode.innerHTML = '<br>'
      line = new Quill.Line(@doc, @lineNode)
      expect(line.node).to.equal(@lineNode)
      expect(line.length).to.equal(0)
      expect(line.leaves.length).to.equal(1)
      expect(line.leaves.first.formats).to.eql({})
      expect(line.leaves.first.text).to.equal('')
    )

    it('lots of children', ->
      @lineNode.innerHTML = '<b><i>A</i><s>B</s></b><img src="http://quilljs.com/images/icon.png"><u>D</u>'
      line = new Quill.Line(@doc, @lineNode)
      expect(line.node).to.equal(@lineNode)
      expect(line.length).to.equal(4)
      expect(line.leaves.length).to.equal(4)
      leaves = line.leaves.toArray()
      expect(leaves[0].formats).to.eql({ bold: true, italic: true })
      expect(leaves[0].text).to.equal('A')
      expect(leaves[1].formats).to.eql({ bold: true, strike: true })
      expect(leaves[1].text).to.equal('B')
      expect(leaves[2].formats).to.eql({ image: 'http://quilljs.com/images/icon.png' })
      expect(leaves[2].text).to.equal(Quill.Format.MEDIA_TEXT)
      expect(leaves[3].formats).to.eql({ underline: true })
      expect(leaves[3].text).to.equal('D')
    )
  )

  describe('deleteText', ->
    # Need to check html input and output
    # delete entire line
    # delete single node
    # delete part of node
    # delete part of multiple nodes
  )

  describe('findLeaf', ->
    # Relies on build leaf but then get one
    # find normal leaf
    # do not find node that is a child but not a leaf
    # find break leaf
    # no match
    # line has no leaves... valid?
  )

  describe('findLeafAt', ->
    # find leaf at boundaries (start and end and beyond end)
      # for normal line and empty line
  )

  describe('format', ->
    # add text align
    # set to different text align
    # add bold
  )

  describe('formatText', ->
    # similar to delete
  )

  describe('insertText', ->
    # insert in middle of two nodes
    # insert in middle of node
    # insert in middle of node with children
    # insert in middle of node but can just adjust text
    # insert into empty line
  )
)
