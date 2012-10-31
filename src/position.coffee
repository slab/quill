#= require underscore
#= require tandem/line

# TODO fix this entire file, esp findDeepestNode
class TandemPosition
  @findDeepestNode: (editor, node, offset) ->
    # We are at right subtree, dive deeper
    isLineNode = Tandem.Line.isLineNode(node)
    if (offset < node.textContent.length) || (offset == node.textContent.length && (!node.nextSibling? || isLineNode)) || (offset == node.textContent.length + 1 && isLineNode && !node.nextSibling?)
      if node.firstChild?
        TandemPosition.findDeepestNode(editor, node.firstChild, if offset == node.textContent.length + 1 then offset - 1 else offset)
      else
        if offset == node.textContent.length && node.nextSibling?
          TandemPosition.findDeepestNode(editor, node.nextSibling, 0)
        else
          return [node, offset]
    else if node.nextSibling?               # Not at right subtree, advance to sibling
      offset -= node.textContent.length + (if isLineNode then 1 else 0)
      TandemPosition.findDeepestNode(editor, node.nextSibling, offset)
    else
      console.error node, offset, editor.doc.root
      throw new Error('Diving exceeded offset')

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
        index += node.textContent.length + (if Tandem.Line.isLineNode(node) then 1 else 0)
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
      @offset = @leafNode
      @index = @leafNode
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
