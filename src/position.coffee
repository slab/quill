_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


class Position
  @findLeafNode: (container, offset) ->
    [node, offset] = Utils.findDeepestNode(container, offset)
    if node.nodeType == DOM.TEXT_NODE
      offset = Position.getIndex(node, offset, node.parentNode)
      node = node.parentNode
    return [node, offset]

  @getIndex: (node, index = 0, offsetNode = null) ->
    while node != offsetNode and node.ownerDocument? and !DOM.hasClass(node, 'editor-container')
      while node.previousSibling?
        node = node.previousSibling
        index += Utils.getNodeLength(node)
      node = node.parentNode
    return index


  # constructor: (Document doc, Object node, Number offset) ->
  # constructor: (Document doc, Number index) ->
  constructor: (@doc, node, offset) ->
    if _.isNumber(node)
      offset = @index = node
      node = @doc.root
    else
      @index = Position.getIndex(node, offset)
    [@leafNode, @offset] = Position.findLeafNode(node, offset)

  getLeaf: ->
    return @leaf if @leaf?
    @leaf = @doc.findLeaf(@leafNode)
    return @leaf

  getIndex: ->
    return Position.getIndex(@leafNode, @offset, @doc.root)


module.exports = Position
