# TODO fix this entire file, esp findDeepestNode
class ScribePosition
  @findDeepestNode: (editor, node, offset) ->
    # We are at right subtree, dive deeper
    isLineNode = Scribe.Line.isLineNode(node)
    nodeLength = Scribe.Utils.getNodeLength(node)
    if isLineNode && offset < nodeLength
      ScribePosition.findDeepestNode(editor, node.firstChild, Math.min(offset, nodeLength))
    else if offset < nodeLength
      if node.firstChild?
        ScribePosition.findDeepestNode(editor, node.firstChild, offset)
      else
        return [node, offset]
    else if node.nextSibling?               # Not at right subtree, advance to sibling
      offset -= nodeLength
      ScribePosition.findDeepestNode(editor, node.nextSibling, offset)
    else if node.lastChild?
      return ScribePosition.findDeepestNode(editor, node.lastChild, Scribe.Utils.getNodeLength(node.lastChild))
    else
      return [node, offset]

  @findLeafNode: (editor, node, offset) ->
    [node, offset] = ScribePosition.findDeepestNode(editor, node, offset)
    if node.nodeType == node.TEXT_NODE
      offset = Scribe.Position.getIndex(node, offset, node.parentNode)
      node = node.parentNode
    return [node, offset]
  
  @getIndex: (node, index, offsetNode = null) ->
    while node != offsetNode && node?.id != Scribe.Editor.CONTAINER_ID
      while node.previousSibling?
        node = node.previousSibling
        index += Scribe.Utils.getNodeLength(node)
      node = node.parentNode
    return index

  @makePosition: (editor, index) ->
    if _.isNumber(index)
      position = new Scribe.Position(editor, index)
    else if index instanceof Scribe.Range
      position = index.start
      index = position.getIndex()
    else
      position = index
      index = position.getIndex()
    return position


  # constructor: (ScribeEditor editor, Object node, Number offset) ->
  # constructor: (ScribeEditor editor, Number index) -> 
  constructor: (@editor, @leafNode, @offset) ->
    if _.isNumber(@leafNode)
      @offset = @index = @leafNode
      @leafNode = @editor.root.firstChild
    [@leafNode, @offset] = ScribePosition.findLeafNode(@editor, @leafNode, @offset)

  getIndex: ->
    @index = ScribePosition.getIndex(@leafNode, @offset) if !@index?
    return @index

  getLeaf: ->
    return @leaf if @leaf?
    @leaf = @editor.doc.findLeaf(@leafNode)
    return @leaf



window.Scribe ||= {}
window.Scribe.Position = ScribePosition
