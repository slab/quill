Scribe = require('./scribe')
Tandem = require('tandem-core')


class Scribe.Line extends LinkedList.Node
  @CLASS_NAME : 'line'
  @ID_PREFIX  : 'line-'

  @FORMATS:
    align: ['center', 'justify', 'left', 'right']

  @MAX_INDENT: 9
  @MIN_INDENT: 1    # Smallest besides not having an indent at all


  @isLineNode: (node) ->
    return node? and Scribe.DOM.hasClass(node, Scribe.Line.CLASS_NAME)

  constructor: (@doc, @node) ->
    @id = _.uniqueId(Scribe.Line.ID_PREFIX)
    @node.id = @id
    Scribe.DOM.addClass(@node, Scribe.Line.CLASS_NAME)
    @trailingNewline = true
    this.rebuild()
    super(@node)

  buildLeaves: (node, formats) ->
    _.each(node.childNodes, (node) =>
      nodeFormats = _.clone(formats)
      [formatName, formatValue] = @doc.formatManager.getFormat(node)
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
    format = @doc.formatManager.formats[name]
    console.warn('Unrecognized format', name) unless format?
    if value
      refNode = null
      formatNode = @doc.formatManager.createFormatContainer(name, value)
      this.applyToContents(offset, length, (node) =>
        refNode = node.nextSibling
        formatNode.appendChild(node)
        Scribe.Utils.removeFormatFromSubtree(node, format)
      )
      @node.insertBefore(formatNode, refNode)
    else
      this.applyToContents(offset, length, (node) =>
        Scribe.Utils.removeFormatFromSubtree(node, format)
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
      return false if @outerHTML? && @outerHTML == @node.outerHTML
      while @leaves? && @leaves.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      @doc.normalizer.normalizeLine(@node)
      @doc.normalizer.optimizeLine(@node)
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
    [formatName, formatValue] = @doc.formatManager.getFormat(@node)
    @formats[formatName] = formatValue if formatName?
    @delta = this.toDelta()

  splitContents: (offset) ->
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
