Scribe = require('./scribe')
Tandem = require('tandem-core')


class Scribe.Line extends LinkedList.Node
  @CLASS_NAME : 'line'
  @DIRTY_CLASS: 'dirty'
  @ID_PREFIX  : 'line-'

  @BLOCK_TAGS: [
    'ADDRESS'
    'BLOCKQUOTE'
    'DD'
    'DIV'
    'DL'
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
    'LI'
    'OL'
    'P'
    'PRE'
    'TABLE'
    'TBODY'
    'TD'
    'TFOOT'
    'TH'
    'THEAD'
    'TR'
    'UL'
  ]

  @BREAK_TAGS: [
    'BR'
    'HR'
  ]

  @FORMATS:
    align: ['center', 'justify', 'left', 'right']


  @isLineNode: (node) ->
    return node? && node.classList? && node.classList.contains(Scribe.Line.CLASS_NAME)

  constructor: (@doc, @node) ->
    @id = _.uniqueId(Scribe.Line.ID_PREFIX)
    @node.id = @id
    @node.classList.add(Scribe.Line.CLASS_NAME)
    @trailingNewline = true
    this.rebuild()
    super(@node)

  buildLeaves: (node, formats) ->
    _.each(Scribe.DOM.filterUneditable(node.childNodes), (node) =>
      nodeFormats = _.clone(formats)
      [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
      nodeFormats[formatName] = formatValue if formatName?
      if Scribe.Leaf.isLeafNode(node)
        @leaves.append(new Scribe.Leaf(this, node, nodeFormats))
      if Scribe.Leaf.isLeafParent(node)
        this.buildLeaves(node, nodeFormats)
    )

  applyToContents: (offset, length, fn) ->
    return if length <= 0
    [prevNode, startNode] = this.splitContents(offset)
    [endNode, nextNode] = this.splitContents(offset + length)
    Scribe.DOM.traverseSiblings(startNode, endNode, fn)

  deleteText: (offset, length) ->
    this.applyToContents(offset, length, (node) ->
      Scribe.Utils.removeNode(node)
    )
    @trailingNewline = false if @length == offset + length
    this.rebuild()

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  findLeafAtOffset: (offset) ->
    for leaf in @leaves.toArray()
      if offset <= leaf.length
        return [leaf, offset]
      else
        offset -= leaf.length
    return [leaf, offset]

  format: (name, value) ->
    console.warn "Unimplemented"

  formatText: (offset, length, name, value) ->
    return if length <= 0
    if value && Scribe.Utils.getFormatDefault(name) != value
      refNode = null
      formatNode = Scribe.Utils.createContainerForFormat(@doc.root.ownerDocument, name, value)
      this.applyToContents(offset, length, (node) =>
        refNode = node.nextSibling
        formatNode.appendChild(node)
        Scribe.Utils.removeFormatFromSubtree(node, name)
      )
      @node.insertBefore(formatNode, refNode)
    else
      this.applyToContents(offset, length, (node) ->
        Scribe.Utils.removeFormatFromSubtree(node, name)
      )
    this.rebuild()

  insertText: (offset, text, formats = {}) ->
    [leaf, leafOffset] = this.findLeafAtOffset(offset)
    # offset > 0 for multicursor
    if _.isEqual(leaf.formats, formats) and @length > 1 and offset > 0
      leaf.insertText(leafOffset, text)
      @length += text.length
      @outerHTML = @node.outerHTML
      @delta = this.toDelta()
    else 
      span = @node.ownerDocument.createElement('span')
      span.textContent = text
      if offset == 0    # Special case for remote cursor preservation
        @node.insertBefore(span, @node.firstChild)
      else
        [prevNode, nextNode] = this.splitContents(offset)
        parentNode = prevNode?.parentNode or nextNode?.parentNode
        parentNode.insertBefore(span, nextNode)
      _.each(formats, (value, name) =>
        this.formatText(offset, text.length, name, value)
      )
      this.rebuild()

  rebuild: ->
    if @node.parentNode == @doc.root
      return false if @outerHTML? && @outerHTML == @node.outerHTML && !@node.classList.contains(Scribe.Line.DIRTY_CLASS)
      while @leaves? && @leaves.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      Scribe.Normalizer.normalizeLine(@node)
      Scribe.Normalizer.optimizeLine(@node)
      this.buildLeaves(@node, {})
      this.resetContent()
    else
      @doc.removeLine(this)
    return true

  resetContent: ->
    @length = _.reduce(@leaves.toArray(), ((length, leaf) -> leaf.length + length), 0)
    @length += 1 if @trailingNewline
    @outerHTML = @node.outerHTML
    @formats = {}
    [formatName, formatValue] = Scribe.Utils.getFormatForContainer(@node)
    @formats[formatName] = formatValue if formatName?
    this.setDirty(false)
    @delta = this.toDelta()

  setDirty: (isDirty = true) ->
    if isDirty
      @node.classList.add(Scribe.Line.DIRTY_CLASS)
    else
      @node.classList.remove(Scribe.Line.DIRTY_CLASS)

  splitContents: (offset) ->
    this.setDirty()
    [node, offset] = Scribe.Utils.getChildAtOffset(@node, offset)
    if @node.tagName == 'OL' || @node.tagName == 'UL'
      [node, offset] = Scribe.Utils.getChildAtOffset(node, offset)
    return Scribe.DOM.splitNode(node, offset)

  toDelta: ->
    ops = _.map(@leaves.toArray(), (leaf) ->
      return new Tandem.InsertOp(leaf.text, leaf.getFormats(true))
    )
    ops.push(new Tandem.InsertOp("\n", @formats)) if @trailingNewline
    delta = new Tandem.Delta(0, @length, ops)
    return delta


module.exports = Scribe
