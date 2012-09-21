#= underscore
#= require rangy/rangy-core

class TandemRange
  @getSelection: (editor) ->
    rangySelection = rangy.getSelection(editor.iframe.contentWindow)
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
    return false unless range?
    return range.start.leafNode == @start.leafNode && range.end.leafNode == @end.leafNode && range.start.offset == @start.offset && range.end.offset == @end.offset
      
  getAttributeIntersection: ->
    leaves = this.getLeaves()
    leaves.pop() if leaves.length > 0 && !this.isCollapsed() && @end.offset == 0
    attributes = if leaves.length > 0 then _.clone(leaves[0].attributes) else {}
    _.all(leaves, (leaf) ->
      _.each(attributes, (value, key) ->
        delete attributes[key] if leaf.attributes[key] != value
      )
      return _.keys(attributes).length > 0
    )
    return attributes

  getLeaves: ->
    itr = new Tandem.LeafIterator(@start.getLeaf(), @end.getLeaf())
    arr = itr.toArray()
    return arr

  getLeafNodes: ->
    range = this.getRangy()
    if range.collapsed
      return [@start.leafNode]
    else
      nodes = _.map(range.getNodes([3]), (node) -> 
        return node.parentNode
      )
      nodes.pop() if nodes[nodes.length - 1] != @end.leafNode || @end.offset == 0
      return nodes

  getLineNodes: ->
    startLine = @editor.doc.findLineNode(@start.leafNode)
    endLine = @editor.doc.findLineNode(@end.leafNode)
    if startLine == endLine
      return [startLine]
    lines = []
    while startLine != endLine
      lines.push(startLine)
      startLine = startLine.nextSibling
    lines.push(endLine)
    return lines

  getRangy: ->
    range = rangy.createRangyRange(@editor.iframe.contentWindow)
    if @start.leafNode.nodeName != 'BR'
      range.setStart(@start.leafNode.firstChild, @start.offset)
    else
      range.setStart(@start.leafNode, 0)
    if @end.leafNode.nodeName != 'BR'
      range.setEnd(@end.leafNode.firstChild, @end.offset)
    else
      range.setEnd(@end.leafNode, 0)
    return range

  isCollapsed: ->
    return @start.leafNode == @end.leafNode && @start.offset == @end.offset


window.Tandem ||= {}
window.Tandem.Range = TandemRange
