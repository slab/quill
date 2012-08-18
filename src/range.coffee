#= underscore
#= require rangy/rangy-core


class TandemRange
  @getSelection: (editor) ->
    rangySelection = rangy.getIframeSelection(editor.iframe)
    return null unless rangySelection.anchorNode? && rangySelection.focusNode?
    if !rangySelection.isBackwards()
      start = new Tandem.Position(editor, rangySelection.anchorNode, rangySelection.anchorOffset)
      end = new Tandem.Position(editor, rangySelection.focusNode, rangySelection.focusOffset)
    else
      start = new Tandem.Position(editor, rangySelection.focusNode, rangySelection.focusOffset)
      end = new Tandem.Position(editor, rangySelection.anchorNode, rangySelection.anchorOffset)
    return new TandemRange(editor, start, end)

  # constructor: (TandemEditor editor, Number startIndex, Number endIndex) ->
  # constructor: (TandemEditor editor, Object start, Object end) ->
  constructor: (@editor, @start, @end) ->
    # TODO initialize with index
    @start = new Tandem.Position(@editor, @start) if _.isNumber(@start)
    @end = new Tandem.Position(@editor, @end) if _.isNumber(@end)

  equals: (range) ->
    return false if range == null
    return range.start.node == @start.node && range.end.node == @end.node && range.start.offset == @start.offset && range.end.offset == @end.offset
      
  getAttributeIntersection: ->
    attributes = null
    _.all(this.getLeafPositions(), (position) ->
      leafAttributes = Tandem.Utils.Node.getAttributes(position.node)
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
      nodes = _.map(range.getNodes([3]), (node) -> 
        return node.parentNode
      )
      nodes.pop() if nodes[nodes.length - 1] != @end.node || @end.offset == 0
      return nodes

  getLeafPositions: ->
    return _.map(this.getLeafNodes(), (node) =>
      return new Tandem.Position(@editor, node, 0)
    )

  groupNodesByLine: ->
    currentLine = 0
    return _.reduce(this.getLeafPositions(), (lines, position) ->
      line = Tandem.Utils.Node.getLine(position.node)
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
window.Tandem.Range = TandemRange
