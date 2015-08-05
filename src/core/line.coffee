_          = require('lodash')
Delta      = require('rich-text/lib/delta')
dom        = require('../lib/dom')
Format     = require('./format')
Leaf       = require('./leaf')
Line       = require('./line')
LinkedList = require('../lib/linked-list')
Normalizer = require('./normalizer')


class Line extends LinkedList.Node
  @DATA_KEY  : 'line'

  constructor: (@doc, @node) ->
    @formats = {}
    this.rebuild()
    super(@node)

  buildLeaves: (node, formats) ->
    _.each(dom(node).childNodes(), (node) =>
      node = @doc.normalizer.normalizeNode(node)
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
    return if leafNode? then dom(leafNode).data(Leaf.DATA_KEY) else undefined

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
      return unless format?
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
          dom(targetNode).splitBefore(@node)
          while !format.match(targetNode)
            targetNode = targetNode.parentNode
          dom(targetNode).split(leaf.length)
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

  _insert: (offset, node, formats) ->
    [leaf, leafOffset] = this.findLeafAt(offset)
    node = _.reduce(formats, (node, value, name) =>
      format = @doc.formats[name]
      if format? and !format.isType(Format.types.LINE)
        node = format.add(node, value)
      return node
    , node)
    [prevNode, nextNode] = dom(leaf.node).split(leafOffset)
    nextNode = dom(nextNode).splitBefore(@node).get() if nextNode
    @node.insertBefore(node, nextNode)
    this.rebuild()

  insertEmbed: (offset, attributes) ->
    [leaf, leafOffset] = this.findLeafAt(offset)
    [prevNode, nextNode] = dom(leaf.node).split(leafOffset)
    formatName = _.find(Object.keys(attributes), (name) =>
      return @doc.formats[name].isType(Format.types.EMBED)
    )
    node = @doc.formats[formatName].add({}, attributes[formatName])  # TODO fix {} hack
    attributes = _.clone(attributes)
    delete attributes[formatName]
    this._insert(offset, node, attributes)

  insertText: (offset, text, formats = {}) ->
    return unless text.length > 0
    [leaf, leafOffset] = this.findLeafAt(offset)
    if _.isEqual(leaf.formats, formats)
      leaf.insertText(leafOffset, text)
      this.resetContent()
    else
      this._insert(offset, document.createTextNode(text), formats)

  optimize: ->
    Normalizer.optimizeLine(@node)
    this.rebuild()

  rebuild: (force = false) ->
    if !force and @outerHTML? and @outerHTML == @node.outerHTML
      if _.all(@leaves.toArray(), (leaf) =>
        return dom(leaf.node).isAncestor(@node)
      )
        return false
    @node = @doc.normalizer.normalizeNode(@node)
    if dom(@node).length() == 0 and !@node.querySelector(dom.DEFAULT_BREAK_TAG)
      @node.appendChild(document.createElement(dom.DEFAULT_BREAK_TAG))
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
    dom(@node).data(Line.DATA_KEY, this)
    @outerHTML = @node.outerHTML
    @length = 1
    @delta = new Delta()
    _.each(@leaves.toArray(), (leaf) =>
      @length += leaf.length
      # TODO use constant for embed type
      if dom.EMBED_TAGS[leaf.node.tagName]?
        @delta.insert(1, leaf.formats)
      else
        @delta.insert(leaf.text, leaf.formats)
    )
    @delta.insert('\n', @formats)


module.exports = Line
