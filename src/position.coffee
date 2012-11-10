# TODO fix this entire file, esp findDeepestNode
class TandemPosition
  @findDeepestNode: (editor, node, offset) ->
    # We are at right subtree, dive deeper
    isLineNode = Tandem.Line.isLineNode(node)
    nodeLength = Tandem.Utils.getNodeLength(node)
    if isLineNode && offset < nodeLength
      TandemPosition.findDeepestNode(editor, node.firstChild, Math.min(offset, nodeLength))
    else if offset < nodeLength
      if node.firstChild?
        TandemPosition.findDeepestNode(editor, node.firstChild, offset)
      else
        return [node, offset]
    else if node.nextSibling?               # Not at right subtree, advance to sibling
      offset -= nodeLength
      TandemPosition.findDeepestNode(editor, node.nextSibling, offset)
    else if node.lastChild?
      return TandemPosition.findDeepestNode(editor, node.lastChild, Tandem.Utils.getNodeLength(node.lastChild))
    else
      return [node, offset]

  @findLeafNode: (editor, node, offset) ->
    [node, offset] = TandemPosition.findDeepestNode(editor, node, offset)
    if node.nodeType == node.TEXT_NODE
      offset = Tandem.Position.getIndex(node, offset, node.parentNode)
      node = node.parentNode
    return [node, offset]
  
  @getIndex: (node, index, offsetNode = null) ->
    while node != offsetNode && node?.id != Tandem.Editor.CONTAINER_ID
      while node.previousSibling?
        node = node.previousSibling
        index += Tandem.Utils.getNodeLength(node)
      node = node.parentNode
    return index

  @makePosition: (editor, index) ->
    if _.isNumber(index)
      position = new Tandem.Position(editor, index)
    else if index instanceof Tandem.Range
      position = index.start
      index = position.getIndex()
    else
      position = index
      index = position.getIndex()
    return position


  # constructor: (TandemEditor editor, Object node, Number offset) ->
  # constructor: (TandemEditor editor, Number index) -> 
  constructor: (@editor, @leafNode, @offset) ->
    if _.isNumber(@leafNode)
      @offset = @index = @leafNode
      @leafNode = @editor.doc.root.firstChild
    [@leafNode, @offset] = TandemPosition.findLeafNode(@editor, @leafNode, @offset)
      
  getIndex: ->
    @index = TandemPosition.getIndex(@leafNode, @offset) if !@index?
    return @index

  getLeaf: ->
    return @leaf if @leaf?
    @leaf = @editor.doc.findLeaf(@leafNode)
    return @leaf



window.Tandem ||= {}
window.Tandem.Position = TandemPosition
