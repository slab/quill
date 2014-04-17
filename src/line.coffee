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
    deleteLength = length
    [leaf, offset] = this.findLeafAt(offset)
    while leaf and deleteLength > 0
      nextLeaf = leaf.next
      if offset == 0 and leaf.length <= deleteLength
        DOM.removeNode(leaf.node)
        @leaves.remove(leaf)
      else
        leaf.deleteText(offset, deleteLength)
      deleteLength -= Math.min(leaf.length, deleteLength)
      leaf = nextLeaf
      offset = 0
    if length == @length
      @node.appendChild(@node.ownerDocument.createElement(DOM.DEFAULT_BREAK_TAG))
      this.rebuild()
    else
      this.resetContent()

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  findLeafAt: (offset) ->
    # TODO exact same code as findLineAt
    return [@leaves.last, 0] if offset == @length
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
    [leaf, leafOffset] = this.findLeafAt(offset)
    format = @doc.formats[name]
    while leaf?
      nextLeaf = leaf.next
      # Make sure we need to change leaf format
      if (value and leaf.formats[name] != value) or (!value and leaf.formats[name]?)
        # Identify node to modify
        targetNode = leaf.node
        while !value and !format.match(targetNode)
          if targetNode.previousSibling?
            targetNode.splitAncestors(targetNode, targetNode.parentNode.parentNode)
          targetNode = targetNode.parentNode
        # Isolate target node
        if leafOffset > 0
          [leftNode, targetNode] = Utils.splitNode(targetNode, leafOffset)
        if leaf.length > leafOffset + length  # leaf.length does not update even though we may have just split leaf.node
          [targetNode, rightNode] = Utils.splitNode(targetNode, length)
        format.add(targetNode, value)
      length -= leaf.length - leafOffset
      leafOffset = 0
      leaf = nextLeaf
    this.rebuild()

  insertText: (offset, text, formats = {}) ->
    return unless text?.length > 0
    [leaf, leafOffset] = this.findLeafAt(offset)
    # offset > 0 for multicursor
    if _.isEqual(leaf.formats, formats) and @length > 1 and offset > 0
      leaf.insertText(leafOffset, text)
      this.resetContent()
    else
      node = _.reduce(formats, (node, value, name) =>
        return @doc.formats[name].add(node, value)
      , @node.ownerDocument.createTextNode(text))
      node = DOM.wrap(@node.ownerDocument.createElement(DOM.DEFAULT_INLNE_TAG), node) if DOM.isTextNode(node)
      [prevNode, nextNode] = Utils.splitNode(leaf.node, leafOffset)
      refNode = Utils.splitAncestors(nextNode, @node)
      @node.insertBefore(node, refNode)
      this.rebuild()

  isNewline: ->
    return @length == 0 and @leaves.length == 1 and @leaves.last.node.tagName == DOM.DEFAULT_BREAK_TAG

  rebuild: (force = false) ->
    if @node.parentNode == @doc.root
      return false if !force and @outerHTML? and @outerHTML == @node.outerHTML
      @node = Normalizer.normalizeNode(@node)
      @leaves = new LinkedList()
      @formats = _.reduce(@doc.formats, (formats, format, name) =>
        formats[name] = format.value(@node) if format.isType(Format.types.LINE) and format.match(@node)
        return formats
      , {})
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
