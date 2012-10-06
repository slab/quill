#= underscore
#= require rangy/rangy-core

class TandemRange
  @getSelection: (editor) ->
    rangySel = rangy.getSelection(editor.iframe.contentWindow)
    return null unless rangySel.anchorNode? && rangySel.focusNode?
    if !rangySel.isBackwards()
      [anchorNode, anchorOffset, focusNode, focusOffset] = [rangySel.anchorNode, rangySel.anchorOffset, rangySel.focusNode, rangySel.focusOffset]
    else
      [focusNode, focusOffset, anchorNode, anchorOffset] = [rangySel.anchorNode, rangySel.anchorOffset, rangySel.focusNode, rangySel.focusOffset]
    start = new Tandem.Position(editor, rangySel.anchorNode, rangySel.anchorOffset)
    end = new Tandem.Position(editor, rangySel.focusNode, rangySel.focusOffset)
    return new TandemRange(editor, start, end)

  @setSelection: (editor, range) ->
    rangySel = rangy.getSelection(editor.iframe.contentWindow)
    rangySelRange = range.getRangy()
    rangySel.setSingleRange(rangySelRange)



  # constructor: (TandemEditor editor, Number startIndex, Number endIndex) ->
  # constructor: (TandemEditor editor, Object start, Object end) ->
  constructor: (@editor, @start, @end) ->
    # TODO initialize with index
    @start = new Tandem.Position(@editor, @start) if _.isNumber(@start)
    @end = new Tandem.Position(@editor, @end) if _.isNumber(@end)

  equals: (range) ->
    return false unless range?
    return range.start.leafNode == @start.leafNode && range.end.leafNode == @end.leafNode && range.start.offset == @start.offset && range.end.offset == @end.offset
      
  getAttributeIntersection: (ignoreValue = false) ->
    startLeaf = this.start.getLeaf()
    endLeaf = this.end.getLeaf()
    # TODO Fix race condition that makes check necessary... should always be able to return attribute intersection
    return {} if !startLeaf? || !endLeaf?
    if this.isCollapsed()
      return startLeaf.getAttributes()
    leaves = this.getLeaves()
    leaves.pop() if leaves.length > 0 && @end.offset == 0
    leaves.splice(0, 1) if leaves.length > 0 && @start.offset == leaves[0].text.length
    attributes = if leaves.length > 0 then leaves[0].getAttributes() else {}
    _.all(leaves, (leaf) ->
      _.each(attributes, (value, key) ->
        delete attributes[key] if leaf.attributes[key] != value && !ignoreValue
      )
      return _.keys(attributes).length > 0
    )
    return attributes

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

  getLeaves: ->
    itr = new Tandem.LeafIterator(@start.getLeaf(), @end.getLeaf())
    arr = itr.toArray()
    return arr

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

  getLines: ->
    return _.map(this.getLineNodes(), (lineNode) ->
      return @editor.doc.findLine(lineNode)
    )

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

  getText: ->
    leaves = this.getLeaves()
    return "" if leaves.length == 0
    line = leaves[0].line
    return _.map(leaves, (leaf) =>
      part = leaf.text
      if leaf == @end.getLeaf()
        part = part.substring(0, @end.offset)
      if leaf == @start.getLeaf()
        part = part.substring(@start.offset)
      if line != leaf.line
        part = "\n" + part
        line = leaf.line
      return part
    ).join('')

  isCollapsed: ->
    return @start.leafNode == @end.leafNode && @start.offset == @end.offset



window.Tandem ||= {}
window.Tandem.Range = TandemRange
