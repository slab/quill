_          = require('lodash')
LinkedList = require('linked-list')
DOM        = require('./dom')
Leaf       = require('./leaf')
Line       = require('./line')
Utils      = require('./utils')
Tandem     = require('tandem-core')

# Note: Because Line uses @outerHTML as a heuristic to rebuild, we must be very careful to actually modify HTML when we modify it. Ex. Do not remove a <br> only to add another one back
# Maybe a better heuristic would also check leaf children are still in the dom

class Line extends LinkedList.Node
  @CLASS_NAME : 'line'
  @ID_PREFIX  : 'line-'

  @FORMATS: ['center', 'justify', 'left', 'right']

  @MAX_INDENT: 9
  @MIN_INDENT: 1    # Smallest besides not having an indent at all

  constructor: (@doc, @node) ->
    @id = _.uniqueId(Line.ID_PREFIX)
    @node.id = @id
    DOM.addClass(@node, Line.CLASS_NAME)
    this.rebuild()
    super(@node)

  applyToContents: (offset, length, fn) ->
    return if length <= 0
    [prevNode, startNode] = this.splitContents(offset)
    [endNode, nextNode] = this.splitContents(offset + length)
    Utils.traverseSiblings(startNode, endNode, fn)

  buildLeaves: (node, formats) ->
    _.each(DOM.getChildNodes(node), (node) =>
      nodeFormats = _.clone(formats)
      [formatName, formatValue] = @doc.formatManager.getFormat(node)
      nodeFormats[formatName] = formatValue if formatName?
      if Leaf.isLeafNode(node)
        @leaves.append(new Leaf(this, node, nodeFormats))
      if Leaf.isLeafParent(node)
        this.buildLeaves(node, nodeFormats)
    )

  deleteText: (offset, length) ->
    return unless length > 0
    this.applyToContents(offset, length, (node) ->
      DOM.removeNode(node)
    )
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
    throw new Error("Unimplemented")

  formatText: (offset, length, name, value) ->
    while length > 0
      op = _.first(@delta.getOpsAt(offset, 1))
      break if (value and op.attributes[name] != value) or (!value and op.attributes[name]?)
      offset += 1
      length -= 1
    while length > 0
      op = _.first(@delta.getOpsAt(offset + length - 1, 1))
      break if (value and op.attributes[name] != value) or (!value and op.attributes[name]?)
      length -= 1
    return unless length > 0
    format = @doc.formatManager.formats[name]
    throw new Error("Unrecognized format #{name}") unless format?
    if value
      refNode = null
      formatNode = @doc.formatManager.createFormatContainer(name, value)
      this.applyToContents(offset, length, (node) =>
        refNode = node.nextSibling
        formatNode.appendChild(node)
        Utils.removeFormatFromSubtree(node, format)
      )
      @node.insertBefore(formatNode, refNode)
    else
      this.applyToContents(offset, length, (node) =>
        Utils.removeFormatFromSubtree(node, format)
      )
    this.rebuild()

  insertText: (offset, text, formats = {}) ->
    return unless text?.length > 0
    [leaf, leafOffset] = this.findLeafAtOffset(offset)
    # offset > 0 for multicursor
    if _.isEqual(leaf.formats, formats) and @length > 1 and offset > 0
      leaf.insertText(leafOffset, text)
      this.resetContent()
    else
      span = @node.ownerDocument.createElement('span')
      DOM.setText(span, text)
      if offset == 0    # Special case for remote cursor preservation
        @node.insertBefore(span, @node.firstChild)
      else
        [prevNode, nextNode] = this.splitContents(offset)
        parentNode = prevNode?.parentNode or nextNode?.parentNode
        parentNode.insertBefore(span, nextNode)
      this.rebuild()
      _.each(formats, (value, name) =>
        this.formatText(offset, text.length, name, value)
      )

  isNewline: ->
    return @length == 0 and @leaves.length == 1 and @leaves.first.node.tagName == 'BR'

  rebuild: (force = false) ->
    if @node.parentNode == @doc.root
      return false if !force and @outerHTML? and @outerHTML == @node.outerHTML
      while @leaves?.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      @doc.normalizer.normalizeLine(@node)
      this.buildLeaves(@node, {})
      this.resetContent()
    else
      @doc.removeLine(this)
    return true

  resetContent: ->
    @length = _.reduce(@leaves.toArray(), ((length, leaf) -> leaf.length + length), 0)
    @outerHTML = @node.outerHTML
    @formats = {}
    [formatName, formatValue] = @doc.formatManager.getFormat(@node)
    @formats[formatName] = formatValue if formatName?
    ops = _.map(@leaves.toArray(), (leaf) ->
      return new Tandem.InsertOp(leaf.text, leaf.getFormats(true))
    )
    @delta = new Tandem.Delta(0, @length, ops)

  splitContents: (offset) ->
    [node, offset] = Utils.getChildAtOffset(@node, offset)
    return Utils.splitNode(node, offset)


module.exports = Line
