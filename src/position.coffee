_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


class Position
  @findLeafNode: (editor, node, offset) ->
    [node, offset] = Utils.findDeepestNode(node, offset)
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


  # constructor: (Editor editor, Object node, Number offset) ->
  # constructor: (Editor editor, Number index) ->
  constructor: (@editor, @leafNode, @offset) ->
    if _.isNumber(@leafNode)
      @offset = @index = @leafNode
      @leafNode = @editor.root
    else
      @index = Position.getIndex(@leafNode, @offset)
    [@leafNode, @offset] = Position.findLeafNode(@editor, @leafNode, @offset)

  getLeaf: ->
    return @leaf if @leaf?
    @leaf = @editor.doc.findLeaf(@leafNode)
    return @leaf

  getIndex: ->
    return Position.getIndex(@leafNode, @offset, @editor.root)


module.exports = Position
