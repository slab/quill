_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


class Normalizer
  @normalizeHTML: (html) ->
    console.log('normalizing', html)
    console.trace()
    return html

  constructor: (@root) ->
    @tags = []
    @styles = []

  normalizeDoc: ->

  normalizeLine: ->

  addStyle: (name) ->
    @styles.push(name)

  addTag: (name) ->
    @tags.push(name)


module.exports = Normalizer
