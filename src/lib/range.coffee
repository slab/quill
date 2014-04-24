_ = require('lodash')


class Range
  @compare: (r1, r2) ->
    return true if r1 == r2           # Covers both is null case
    return false unless r1? and r2?   # If either is null they are not equal
    return r1.equals(r2)

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
