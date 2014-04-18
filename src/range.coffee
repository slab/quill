_ = require('lodash')


class Range
  constructor: (@doc, @start, @end) ->

  equals: (range) ->
    return false unless range?
    return @doc == range.doc and @start == range.start and @end == range.end

  isCollapsed: ->
    return @start == @end


module.exports = Range
