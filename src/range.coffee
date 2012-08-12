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

  getAncestorNodes: (includeSelf = false) ->
    ancestors = []
    node = @node
    ancestors.push(node) if includeSelf && node.className != 'line'
    while node.className != 'line'
      ancestors.push(node)
      node = node.parentNode
    ancestors.push(node)
    return ancestors

  getAttributes: ->
    return _.reduce(this.getAncestorNodes(), (attributes, node) ->
      switch node.tagName
        when 'B' then attributes['bold'] = true
        when 'I' then attributes['italic'] = true
        when 'S' then attributes['strike'] = true
        when 'U' then attributes['underline'] = true
      return attributes
    , {})
    
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
    ancestors = this.getAncestorNodes()
    return ancestors[ancestors.length - 1]


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
    _.all(this.getLeafPositions(), (position) ->
      leafAttributes = position.getAttributes()
      if attributes
        _.each(attributes, (value, key) ->
          if leafAttributes[key] != true
            delete attributes[key]
        )
      else
        attributes = leafAttributes
      for key,value of attributes when value == true
        return true
      return false
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
      return _.map(range.getNodes([3]), (node) -> 
        return node.parentNode
      )

  getLeafPositions: ->
    return _.map(this.getLeafNodes(), (node) =>
      return new TandemPosition(@editor, node, 0)
    )

  groupNodesByLine: ->
    currentLine = 0
    return _.reduce(this.getLeafPositions(), (lines, position) ->
      line = position.getLine()
      if currentLine == line
        lines[lines.length - 1].push(position.node)
      else
        lines.push([position.node])
        currentLine = line
      return lines
    , [])

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
