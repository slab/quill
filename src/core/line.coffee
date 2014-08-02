_          = require('lodash')
dom        = require('../lib/dom')
Format     = require('./format')
Leaf       = require('./leaf')
Line       = require('./line')
LinkedList = require('../lib/linked-list')
Normalizer = require('../lib/normalizer')
Tandem     = require('tandem-core')


class Line extends LinkedList.Node
  @CLASS_NAME : 'line'
  @ID_PREFIX  : 'line-'

  constructor: (@doc, @node) ->
    @id = _.uniqueId(Line.ID_PREFIX)
    @formats = {}
    dom(@node).addClass(Line.CLASS_NAME)
    this.rebuild()
    super(@node)

  buildLeaves: (node, formats) ->
    _.each(dom(node).childNodes(), (node) =>
      node = Normalizer.normalizeNode(node)
      nodeFormats = _.clone(formats)
      # TODO: optimize
      _.each(@doc.formats, (format, name) ->
        # format.value() also checks match() but existing bug in tandem-core requires check anyways
        nodeFormats[name] = format.value(node) if !format.isType(Format.types.LINE) and format.match(node)
      )
      if Leaf.isLeafNode(node)
        @leaves.append(new Leaf(node, nodeFormats))
      else
        this.buildLeaves(node, nodeFormats)
    )

  deleteText: (offset, length) ->
    return unless length > 0
    [leaf, offset] = this.findLeafAt(offset)
    while leaf? and length > 0
      deleteLength = Math.min(length, leaf.length - offset)
      leaf.deleteText(offset, deleteLength)
      length -= deleteLength
      leaf = leaf.next
      offset = 0
    this.rebuild()

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  findLeafAt: (offset, inclusive = false) ->
    # TODO exact same code as findLineAt
    return [@leaves.last, @leaves.last.length] if offset >= @length - 1
    leaf = @leaves.first
    while leaf?
      if offset < leaf.length or (offset == leaf.length and inclusive)
        return [leaf, offset]
      offset -= leaf.length
      leaf = leaf.next
    return [@leaves.last, offset - @leaves.last.length]   # Should never occur unless length calculation is off

  format: (name, value) ->
    if _.isObject(name)
      formats = name
    else
      formats = {}
      formats[name] = value
    _.each(formats, (value, name) =>
      format = @doc.formats[name]
      # TODO reassigning @node might be dangerous...
      if format.isType(Format.types.LINE)
        if format.config.exclude and @formats[format.config.exclude]
          excludeFormat = @doc.formats[format.config.exclude]
          if excludeFormat?
            @node = excludeFormat.remove(@node)
            delete @formats[format.config.exclude]
        @node = format.add(@node, value)
      if value
        @formats[name] = value
      else
        delete @formats[name]
    )
    this.resetContent()

  formatText: (offset, length, name, value) ->
    [leaf, leafOffset] = this.findLeafAt(offset)
    format = @doc.formats[name]
    return unless format? and format.config.type != Format.types.LINE
    while leaf? and length > 0
      nextLeaf = leaf.next
      # Make sure we need to change leaf format
      if (value and leaf.formats[name] != value) or (!value and leaf.formats[name]?)
        targetNode = leaf.node
        # Identify node to modify
        if leaf.formats[name]?
          dom(targetNode).splitAncestors(@node)
          while !format.match(targetNode)
            targetNode = targetNode.parentNode
        # Isolate target node
        if leafOffset > 0
          [leftNode, targetNode] = dom(targetNode).split(leafOffset)
        if leaf.length > leafOffset + length  # leaf.length does not update with split()
          [targetNode, rightNode] = dom(targetNode).split(length)
        format.add(targetNode, value)
      length -= leaf.length - leafOffset
      leafOffset = 0
      leaf = nextLeaf
    this.rebuild()

  insertText: (offset, text, formats = {}) ->
    return unless text.length > 0
    [leaf, leafOffset] = this.findLeafAt(offset)
    # offset > 0 for multicursor
    if _.isEqual(leaf.formats, formats)
      leaf.insertText(leafOffset, text)
      this.resetContent()
    else
      node = _.reduce(formats, (node, value, name) =>
        return @doc.formats[name].add(node, value)
      , @node.ownerDocument.createTextNode(text))
      [prevNode, nextNode] = dom(leaf.node).split(leafOffset)
      nextNode = dom(nextNode).splitAncestors(@node).get() if nextNode
      @node.insertBefore(node, nextNode)
      this.rebuild()

  optimize: ->
    Normalizer.optimizeLine(@node)
    this.rebuild()

  rebuild: (force = false) ->
    if !force and @outerHTML? and @outerHTML == @node.outerHTML
      if _.all(@leaves.toArray(), (leaf) ->
        return leaf.node.parentNode?
      )
        return false
    @node = Normalizer.normalizeNode(@node)
    if dom(@node).length() == 0 and !@node.querySelector(dom.DEFAULT_BREAK_TAG)
      @node.appendChild(@node.ownerDocument.createElement(dom.DEFAULT_BREAK_TAG))
    @leaves = new LinkedList()
    @formats = _.reduce(@doc.formats, (formats, format, name) =>
      if format.isType(Format.types.LINE)
        if format.match(@node)
          formats[name] = format.value(@node)
        else
          delete formats[name]
      return formats
    , @formats)
    this.buildLeaves(@node, {})
    this.resetContent()
    return true

  resetContent: ->
    @node.id = @id unless @node.id == @id
    @outerHTML = @node.outerHTML
    @length = 1
    ops = _.map(@leaves.toArray(), (leaf) =>
      @length += leaf.length
      return new Tandem.InsertOp(leaf.text, leaf.formats)
    )
    ops.push(new Tandem.InsertOp('\n', @formats))
    @delta = new Tandem.Delta(0, @length, ops)


module.exports = Line
