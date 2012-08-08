#= require rangy/rangy-core

class SelectionRange
  @getCurrent: (iframe) ->
    rangySelection = rangy.getIframeSelection(iframe)
    if !rangySelection.isBackwards()
      start = new rangy.dom.DomPosition(rangySelection.anchorNode, rangySelection.anchorOffset)
      end = new rangy.dom.DomPosition(rangySelection.focusNode, rangySelection.focusOffset)
    else
      start = new rangy.dom.DomPosition(rangySelection.focusNode, rangySelection.focusOffset)
      end = new rangy.dom.DomPosition(rangySelection.anchorNode, rangySelection.anchorOffset)

    [start, end] = _.map([start, end], (position) ->
      # Guarantee nodes are text leaf nodes
      return position if position.node.childNodes.length == 0
      node = position.node
      offset = position.offset
      while node.childNodes.length > 0
        node = node.firstChild
        while offset > node.length
          offset -= node.length
          node = node.nextSibling
      return new rangy.dom.DomPosition(node, offset)
    )

    return new SelectionRange(iframe, start, end)

  # constructor: (@iframe, Number startIndex, Number endIndex) ->
  # constructor: (@iframe, Object start, Object end) ->
  constructor: (@iframe, @start, @end) ->
    #if _.isNumber(@end)
      # TODO initialize with index

    @iframeDoc = @iframe.contentWindow.document

  split: (position, before = true) ->
    node = position.node.parentNode
    newNode = @iframeDoc.createElement(node.tagName)
    beforeText = node.innerText.substring(0, position.offset)
    afterText = node.innerText.substring(position.offset)
    if before
      newNode.innerText = beforeText
      node.innerText = afterText
      node.parentNode.insertBefore(newNode, node)
    else
      node.innerText = beforeText
      newNode.innerText = afterText
      node.parentNode.insertBefore(newNode, node.nextSibling)

  splitBefore: ->
    this.split(@start, true)
    @end.offset -= @start.offset if @end.node == @start.node
    @start.offset -= @start.offset

  splitAfter: ->
    this.split(@end, false)

  splitEnds: ->
    this.splitBefore()
    this.splitAfter()

  getText: ->

  getNodes: ->

  getStartIndex: ->

  getEndIndex: ->

  getRange: ->


window.Tandem ||= {}
window.Tandem.Range = SelectionRange
