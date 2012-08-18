#= require underscore

class TandemPosition
  # constructor: (TandemEditor editor, Object node, Number offset) ->
  # constructor: (TandemEditor editor, Number index) -> 

  # Finds the HTML node and offset where offset will be within node's boundaries
  # Ex. <b>Te</b><i>ing</i>
  #     The 'i' can either be (<b>, 2) or or (<i>, 0)
  #     adjustOffset will pick the latter
  @adjustOffset: (node, offset) ->
    if offset <= node.textContent.length    # We are at right subtree, dive deeper
      if node.firstChild?
        TandemPosition.adjustOffset(node.firstChild, offset)
      else
        node = node.parentNode
        if offset == node.textContent.length && node.nextSibling?
          TandemPosition.adjustOffset(node.nextSibling, 0)
        else
          return [node, offset]
    else if node.nextSibling?               # Not at right subtree, advance to sibling
      offset -= 1 if node.className == 'line'
      TandemPosition.adjustOffset(node.nextSibling, offset - node.textContent.length)
    else
      throw Error('Diving exceeded offset')

  constructor: (@editor, @node, @offset) ->
    if _.isNumber(@node)
      @offset = @node
      @node = @editor.iframeDoc.body.firstChild
    [@node, @offset] = TandemPosition.adjustOffset(@node, @offset)
    @text = @node.textContent   # For testing convenience
    
  getIndex: ->
    return @index if @index?
    @index = @offset
    node = @node
    while node.tagName != 'BODY'
      while node.previousSibling?
        node = node.previousSibling
        @index += node.textContent.length + (if node.className == 'line' then 1 else 0) # Account for newline char
      node = node.parentNode
    return @index



window.Tandem ||= {}
window.Tandem.Position = TandemPosition
