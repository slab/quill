#= require underscore
#= require tandem/line

class TandemPosition
  @findDeepestNode: (editor, node, offset) ->
    if offset <= node.textContent.length    # We are at right subtree, dive deeper
      if node.firstChild? && node.firstChild.nodeType != node.TEXT_NODE
        TandemPosition.findDeepestNode(editor, node.firstChild, offset)
      else
        if offset == node.textContent.length && node.nextSibling?
          TandemPosition.findDeepestNode(editor, node.nextSibling, 0)
        else
          return [node, offset]
    else if node.nextSibling?               # Not at right subtree, advance to sibling
      if Tandem.Line.isLineNode(node)
        line = editor.doc.findLine(node)
        offset -= line.length + 1
      else
        offset -= node.textContent.length
      TandemPosition.findDeepestNode(editor, node.nextSibling, offset)
    else
      console.error node, offset, editor.doc.root
      throw new Error('Diving exceeded offset')

  @findLeafNode: (editor, node, offset) ->
    [node, offset] = TandemPosition.findDeepestNode(editor, node, offset)
    # TODO potential bug if double text node has sibling text node
    node = node.parentNode if node.nodeType == node.TEXT_NODE
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
