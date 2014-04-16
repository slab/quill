_          = require('lodash')
LinkedList = require('linked-list')
DOM        = require('./dom')
Format     = require('./format')
Leaf       = require('./leaf')
Line       = require('./line')
Normalizer = require('./normalizer')
Utils      = require('./utils')
Tandem     = require('tandem-core')

# Note: Because Line uses @outerHTML as a heuristic to rebuild, we must be very careful to actually modify HTML when we modify it. Ex. Do not remove a <br> only to add another one back
# Maybe a better heuristic would also check leaf children are still in the dom

removeFormat = (format, subtree) ->
  return unless DOM.isElement(subtree)
  nodes = DOM.getDescendants(subtree)
  nodes.push(subtree)
  _.each(nodes, _.bind(format.remove, format))


class Line extends LinkedList.Node
  @CLASS_NAME : 'line'
  @ID_PREFIX  : 'line-'

  constructor: (@doc, @node) ->
    @id = _.uniqueId(Line.ID_PREFIX)
    @node.id = @id
    DOM.addClass(@node, Line.CLASS_NAME)
    this.rebuild()
    super(@node)

  applyToContents: (offset, length, fn) ->
    [startNode, endNode] = Utils.partitionChildren(@node, offset, length)
    curNode = startNode
    endNode = endNode.nextSibling if curNode == endNode
    while curNode? and curNode != endNode
      nextNode = curNode.nextSibling
      fn(curNode)
      curNode = nextNode
    return [startNode, endNode]

  buildLeaves: (node, formats) ->
    _.each(DOM.getChildNodes(node), (node) =>
      node = Normalizer.normalizeNode(node)
      nodeFormats = _.clone(formats)
      # TODO: optimize
      _.each(@doc.formats, (format, name) ->
        # format.value() also checks match() but existing bug in tandem-core requires check anyways
        nodeFormats[name] = format.value(node) if format.match(node)
      )
      if Leaf.isLeafNode(node)
        @leaves.append(new Leaf(node, nodeFormats))
      else
        this.buildLeaves(node, nodeFormats)
    )

  deleteText: (offset, length) ->
    return unless length > 0
    this.applyToContents(offset, length, DOM.removeNode)
    this.rebuild()

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  findLeafAt: (offset) ->
    # TODO exact same code as findLineAt
    leaf = @leaves.first
    while leaf?
      return [leaf, offset] if offset < leaf.length
      offset -= leaf.length
      leaf = leaf.next
    return [null, offset]

  format: (name, value) ->
    format = @doc.formats[name]
    # TODO reassigning @node might be dangerous...
    if format.isType(Format.types.LINE)
      @node = format.add(@node, value)
    if value
      @formats[name] = value
    else
      delete @formats[name]

  formatText: (offset, length, name, value) ->
    # Skip portions of text that already has format
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
    format = @doc.formats[name]
    throw new Error("Unrecognized format #{name}") unless format?
    if value
      this.applyToContents(offset, length, (node) =>
        # TODO need to handle case where middle portion of text is already formatted with this
        # removeFormat(format, node)
        format.add(node, value)
      )
    else
      this.applyToContents(offset, length, _.bind(removeFormat, this, format))
    this.rebuild()

  insertText: (offset, text, formats = {}) ->
    return unless text?.length > 0
    [leaf, leafOffset] = this.findLeafAt(offset)
    # offset > 0 for multicursor
    if _.isEqual(leaf.formats, formats) and @length > 1 and offset > 0
      leaf.insertText(leafOffset, text)
      this.resetContent()
    else
      inline = @node.ownerDocument.createElement(DOM.DEFAULT_INLNE_TAG)
      DOM.setText(inline, text)
      if offset == 0    # Special case for remote cursor preservation
        @node.insertBefore(inline, @node.firstChild)
      else
        [prevNode, nextNode] = Utils.splitChild(@node, offset)
        parentNode = prevNode?.parentNode or nextNode?.parentNode
        parentNode.insertBefore(inline, nextNode)
      this.rebuild()
      _.each(formats, (value, name) =>
        this.formatText(offset, text.length, name, value)
      )

  isNewline: ->
    return @length == 0 and @leaves.length == 1 and @leaves.first.node.tagName == DOM.DEFAULT_BREAK_TAG

  rebuild: (force = false) ->
    if @node.parentNode == @doc.root
      return false if !force and @outerHTML? and @outerHTML == @node.outerHTML
      while @leaves?.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      @formats = _.reduce(@doc.formats, (formats, format, name) =>
        formats[name] = format.value(@node) if format.isType(Format.types.LINE) and format.match(@node)
        return formats
      , {})
      @node = Normalizer.normalizeNode(@node)
      this.buildLeaves(@node, {})
      this.resetContent()
    else
      @doc.removeLine(this)
    return true

  resetContent: ->
    @length = _.reduce(@leaves.toArray(), ((length, leaf) -> leaf.length + length), 0)
    @outerHTML = @node.outerHTML
    ops = _.map(@leaves.toArray(), (leaf) ->
      return new Tandem.InsertOp(leaf.text, leaf.getFormats(true))
    )
    @delta = new Tandem.Delta(0, @length, ops)


module.exports = Line
