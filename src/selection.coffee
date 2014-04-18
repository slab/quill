_     = require('lodash')
rangy = require('rangy-core')
Range = require('./range')


class Selection
  constructor: (@doc, @emitter) ->

  preserve: (index, lengthAdded, fn) ->
    fn = index if _.isFunction(index)
    fn.call(this)

  getRange: ->

  setRange: ->

  update: ->


module.exports = Selection
