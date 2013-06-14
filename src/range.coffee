Scribe = require('./scribe')


rangy.init()  # getRangy

class Scribe.Range
  # constructor: (Editor editor, Number startIndex, Number endIndex) ->
  # constructor: (Editor editor, Object start, Object end) ->
  constructor: (@editor, @start, @end) ->
    # TODO initialize with index
    @start = new Scribe.Position(@editor, @start) if _.isNumber(@start)
    @end = new Scribe.Position(@editor, @end) if _.isNumber(@end)

  equals: (range) ->
    return false unless range?
    return range.start.leafNode == @start.leafNode && range.end.leafNode == @end.leafNode && range.start.offset == @start.offset && range.end.offset == @end.offset
  
  # TODO implement the following:    
  # Return object representing intersection of formats of leaves in range
  # Values can be number or string representing value all leaves in range have, or an array of values if mixed (falsy values removed)
  # If all leaves have same format, the default, it is omitted
  # Ex.
  # <span>Normal</span>             -> {}
  # <b>Bold</b>                     -> {bold: true}
  # <b>Bold</b><span>Normal</span>  -> {bold: [true]}
  # <span class='size.huge'>Huge</span><span class='size.small'>Small</span>                    -> {size: ['huge', 'small']}
  # <span class='size.huge'>Huge</span><span>Normal</span>                                           -> {size: ['huge']}
  # <span class='size.huge'>Huge</span><span>Normal</span><span class='size.small'>Small</span> -> {size: ['huge', 'normal', 'small']}
  getFormats: ->
    return @formats if @formats?
    startLeaf = this.start.getLeaf()
    endLeaf = this.end.getLeaf()
    # TODO Fix race condition that makes check necessary... should always be able to return format intersection
    return {} if !startLeaf? || !endLeaf?
    if this.isCollapsed()
      return startLeaf.getFormats()
    leaves = this.getLeaves()
    leaves.pop() if leaves.length > 1 && @end.offset == 0
    leaves.splice(0, 1) if leaves.length > 1 && @start.offset == leaves[0].length
    formats = if leaves.length > 0 then leaves[0].getFormats() else {}
    _.all(leaves, (leaf) ->
      leafFormats =  leaf.getFormats()
      _.each(formats, (value, key) ->
        if !leafFormats[key]
          delete formats[key]
        else if leafFormats[key] != value
          if !_.isArray(value)
            formats[key] = [value]
          formats[key].push(leafFormats[key])
      )
      return _.keys(formats).length > 0
    )
    _.each(formats, (value, key) ->
      formats[key] = _.uniq(value) if _.isArray(value)
    )
    @formats = formats
    return formats

  getLeafNodes: ->
    return [@start.leafNode] if this.isCollapsed()
    leafIterator = new Scribe.LeafIterator(@start.getLeaf(), @end.getLeaf())
    leafNodes = _.pluck(leafIterator.toArray(), 'node')
    leafNodes.pop() if leafNodes[leafNodes.length - 1] != @end.leafNode || @end.offset == 0
    return leafNodes

  getLeaves: ->
    itr = new Scribe.LeafIterator(@start.getLeaf(), @end.getLeaf())
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
    return _.map(this.getLineNodes(), (lineNode) =>
      return @editor.doc.findLine(lineNode)
    )

  getRangy: ->
    range = rangy.createRangyRange(@editor.contentWindow)
    if @start.leafNode.nodeName != 'BR' and @start.leafNode.firstChild?
      range.setStart(@start.leafNode.firstChild, @start.offset)
    else
      range.setStart(@start.leafNode, 0)
    if @end.leafNode.nodeName != 'BR' and @end.leafNode.firstChild?
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


module.exports = Scribe
