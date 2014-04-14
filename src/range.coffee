_        = require('lodash')
Position = require('./position')


class Range
  constructor: (@doc, @start, @end) ->
    @start = new Position(@doc, @start) if _.isNumber(@start)
    @end = new Position(@doc, @end) if _.isNumber(@end)

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
    if this.isCollapsed()
      leaf = @start.getLeaf()
      return if leaf then leaf.getFormats() else {}
    delta = @doc.toDelta()
    ops = delta.getOpsAt(@start.index, @end.index - @start.index)
    # TODO newlines should not be ignored
    ops = _.filter(ops, (op) ->
      return op.value != '\n'
    )
    formats = _.pluck(ops, 'attributes')
    return {} unless formats.length > 0
    # TODO while efficient, this algorithm is unnecessarily complicated...
    result = formats[0]
    _.all(formats.slice(1), (format) ->
      _.each(result, (value, key) ->
        if !format[key]
          delete result[key]
        else if format[key] != value
          if !_.isArray(value)
            result[key] = [value]
          result[key].push(formats[key])
      )
      return _.keys(result).length > 0
    )
    _.each(result, (value, key) ->
      result[key] = _.uniq(value) if _.isArray(value)
    )
    return result

  getLineNodes: ->
    startLine = @doc.findLineNode(@start.leafNode)
    endLine = @doc.findLineNode(@end.leafNode)
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
      return @doc.findLine(lineNode)
    )

  getText: ->
    delta = @doc.toDelta()
    ops = delta.getOpsAt(@start.index, @end.index - @start.index)
    # TODO remove duplication with Quill.getText
    return _.pluck(ops, 'value').join('')

  isCollapsed: ->
    return @start.leafNode == @end.leafNode && @start.offset == @end.offset


module.exports = Range
