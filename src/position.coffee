Scribe = require('./scribe')


# TODO fix this entire file, esp findDeepestNode
class Scribe.Position
  @findDeepestNode: (node, offset) ->
    if node.firstChild?
      for child in Scribe.DOM.filterUneditable(node.childNodes)
        length = Scribe.Utils.getNodeLength(child)
        if offset < length
          return Scribe.Position.findDeepestNode(child, offset)
        else
          offset -= length
      return Scribe.Position.findDeepestNode(child, offset + length)
    else
      return [node, offset]

  @findLeafNode: (editor, node, offset) ->
    [node, offset] = Scribe.Position.findDeepestNode(node, offset)
    if node.nodeType == node.TEXT_NODE
      offset = Scribe.Position.getIndex(node, offset, node.parentNode)
      node = node.parentNode
    return [node, offset]
  
  @getIndex: (node, index, offsetNode = null) ->
    while node != offsetNode and node.parentNode != node.ownerDocument.body
      while node.previousSibling?
        node = node.previousSibling
        index += Scribe.Utils.getNodeLength(node)
      node = node.parentNode
    return index


  # constructor: (Editor editor, Object node, Number offset) ->
  # constructor: (Editor editor, Number index) -> 
  constructor: (@editor, @leafNode, @offset) ->
    if _.isNumber(@leafNode)
      @offset = @index = @leafNode
      @leafNode = @editor.root
    else
      @index = Scribe.Position.getIndex(@leafNode, @offset)
    [@leafNode, @offset] = Scribe.Position.findLeafNode(@editor, @leafNode, @offset)

  getLeaf: ->
    return @leaf if @leaf?
    @leaf = @editor.doc.findLeaf(@leafNode)
    return @leaf


module.exports = Scribe
