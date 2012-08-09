#= underscore
#= require rangy/rangy-core


# Class giving 
class TandemPosition
  # constructor: (TandemEditor editor, Object node, Number offset) ->
  # constructor: (TandemEditor editor, Number index) -> 
  constructor: (@editor, @node, @offset) ->
    if _.isNumber(@node)
      @index = @node
      @offset = @node
      @node = @editor.iframeDoc.body
    while @node.childNodes.length > 0
      @node = @node.firstChild
      newline = if @node.className == 'line' then 1 else 0      # Account for newline char
      while @offset > @node.textContent.length + newline
        @offset -= @node.textContent.length + newline
        @node = @node.nextSibling
        throw Error('TandemPosition index greater than editor size') if @node == null
    @node = @node.parentNode
    @text = @node.textContent

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


class TandemRange
  @getCurrent: (editor) ->
    rangySelection = rangy.getIframeSelection(editor.iframe)
    return null unless rangySelection.anchorNode? && rangySelection.focusNode?
    if !rangySelection.isBackwards()
      start = new TandemPosition(editor, rangySelection.anchorNode, rangySelection.anchorOffset)
      end = new TandemPosition(editor, rangySelection.focusNode, rangySelection.focusOffset)
    else
      start = new TandemPosition(editor, rangySelection.focusNode, rangySelection.focusOffset)
      end = new TandemPosition(editor, rangySelection.anchorNode, rangySelection.anchorOffset)
    return new TandemRange(editor, start, end)

  # constructor: (TandemEditor editor, Number startIndex, Number endIndex) ->
  # constructor: (TandemEditor editor, Object start, Object end) ->
  constructor: (@editor, @start, @end) ->
    # TODO initialize with index
    @start = new TandemPosition(@editor, @start) if _.isNumber(@start) 
    @end = new TandemPosition(@editor, @end) if _.isNumber(@end)

  equals: (range) ->
    return false if range == null
    return range.start.node == @start.node && range.end.node == @end.node && range.start.offset == @start.offset && range.end.offset == @end.offset
      
  getRangy: ->
    range = rangy.createRangyRange(@editor.iframe)
    range.setStart(@start.node.firstChild, @start.offset)
    range.setEnd(@end.node.firstChild, @end.offset)
    return range

  groupNodesByLine: ->
    range = this.getRangy()
    textNodes = _.map(range.getNodes([3]), (node) -> return node.parentNode)
    currentAncestor = 0
    arr = _.reduce(textNodes, (memo, node) ->
      ancestor = node.parentNode
      while ancestor.className != "line"
        ancestor = ancestor.parentNode
      if currentAncestor == ancestor
        memo[memo.length - 1].push(node)
      else
        memo.push([node])
        currentAncestor = ancestor
      return memo
    , [])
    return arr

  split: (position, before = true) ->
    newNode = @editor.iframeDoc.createElement(position.node.tagName)
    beforeText = position.node.textContent.substring(0, position.offset)
    afterText = position.node.textContent.substring(position.offset)
    return if beforeText == '' || afterText == ''
    if before
      newNode.textContent = beforeText
      position.node.textContent = afterText
      position.node.parentNode.insertBefore(newNode, position.node)
    else
      position.node.textContent = beforeText
      newNode.textContent = afterText
      position.node.parentNode.insertBefore(newNode, position.node.nextSibling)

  splitBefore: ->
    this.split(@start, true)
    @end.offset -= @start.offset if @end.node == @start.node
    @start.offset -= @start.offset

  splitAfter: ->
    this.split(@end, false)

  splitEnds: ->
    this.splitBefore()
    this.splitAfter()


window.Tandem ||= {}
window.Tandem.Range = TandemRange
