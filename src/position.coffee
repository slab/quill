#= require underscore
#= require tandem/line

class TandemPosition
  @findLeafNode: (editor, node, offset, ignoreNewline = false) ->
    textLength = if node.tagName == 'BR' then 0 else node.textContent.length
    if offset <= textLength    # We are at right subtree, dive deeper
      if node.firstChild?
        TandemPosition.findLeafNode(editor, node.firstChild, offset, ignoreNewline)
      else
        # TODO potential bug if double text node has sibling text node
        node = node.parentNode if node.nodeType == node.TEXT_NODE
        if offset == textLength && node.nextSibling?
          TandemPosition.findLeafNode(editor, node.nextSibling, 0, ignoreNewline)
        else
          return [node, offset]
    else if node.nextSibling?               # Not at right subtree, advance to sibling
      if Tandem.Line.isLineNode(node)
        line = editor.doc.findLine(node)
        length = line.length + (if ignoreNewline then 0 else 1)
        offset -= length
      else
        offset -= textLength
      TandemPosition.findLeafNode(editor, node.nextSibling, offset, ignoreNewline)
    else
      throw new Error('Diving exceeded offset')

  @getIndex: (node, index, ignoreNewline = false) ->
    while node.tagName != 'BODY'
      while node.previousSibling?
        node = node.previousSibling
        length = if node.tagName != 'BR' then node.textContent.length else 0
        index += length + (if ignoreNewline || !Tandem.Line.isLineNode(node) then 0 else 1)
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
  constructor: (@editor, @leafNode, @offset, ignoreNewline = false) ->
    if _.isNumber(@leafNode)
      @offset = @leafNode
      @index = @leafNode
      @leafNode = @editor.doc.root.firstChild
    [@leafNode, @offset] = TandemPosition.findLeafNode(@editor, @leafNode, @offset, ignoreNewline)
      
  getIndex: ->
    @index = TandemPosition.getIndex(@leafNode, @offset) if !@index?
    return @index

  getLeaf: ->
    return @leaf if @leaf?
    @leaf = @editor.doc.findLeaf(@leafNode)
    return @leaf



window.Tandem ||= {}
window.Tandem.Position = TandemPosition
