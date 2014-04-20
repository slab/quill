class Range
  constructor: (@doc, @start, @end) ->

  equals: (range) ->
    return false unless range?
    return @doc == range.doc and @start == range.start and @end == range.end

  shift: (index, length) ->
    @start += length
    @end += length

  isCollapsed: ->
    return @start == @end


module.exports = Range
