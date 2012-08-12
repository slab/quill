#= underscore
#= require rangy/rangy-core


# Class giving 
class TandemPosition
  # constructor: (TandemEditor editor, Object node, Number offset) ->
  # constructor: (TandemEditor editor, Number index) -> 

  # Finds the HTML node and offset where offset will be within node's boundaries
  # Ex. <b>Te</b><i>ing</i>
  #     The 'i' can either be (<b>, 2) or or (<i>, 0)
  #     Dive will pick the latter
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

  getLine: ->
    line = @node
    while @node.className != 'line'
      line = @node.parentNode
    return line


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
      
  getAttributeIntersection: ->
    attributes = null
    console.log 'leaf', this.getLeafNodes()
    _.all(this.getLeafNodes(), (node) ->
      leafAttributes = []
      while node.className != 'line'
        switch node.tagName
          when 'B' then leafAttributes['bold'] = true
          when 'I' then leafAttributes['italic'] = true
          when 'S' then leafAttributes['strike'] = true
          when 'U' then leafAttributes['underline'] = true
        node = node.parentNode
      if attributes
        _.each(attributes, (value, key) ->
          if leafAttributes[key] != true
            delete attributes[key]
        )
      else
        attributes = leafAttributes
    )

    return attributes || {}

  getRangy: ->
    range = rangy.createRangyRange(@editor.iframe)
    range.setStart(@start.node.firstChild, @start.offset)
    range.setEnd(@end.node.firstChild, @end.offset)
    return range

  getLeafNodes: ->
    range = this.getRangy()
    if range.collapsed
      return [@start.node]
    else
      return _.map(range.getNodes([3]), (node) -> return node.parentNode)

  groupNodesByLine: ->
    currentAncestor = 0
    arr = _.reduce(this.getLeafNodes(), (memo, node) ->
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
window.Tandem.Position = TandemPosition
window.Tandem.Range = TandemRange
