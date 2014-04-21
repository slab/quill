_ = require('lodash')


class Range
  constructor: (@start, @end) ->

  equals: (range) ->
    return false unless range?
    return @start == range.start and @end == range.end

  shift: (index, length) ->
    [@start, @end] = _.map([@start, @end], (pos) ->
      return if index <= pos then pos + length else Math.min(index + length, pos)
    )

  isCollapsed: ->
    return @start == @end


module.exports = Range
