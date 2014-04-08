_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


class Normalizer
  @normalizeHTML: (html) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s+/, '').replace(/\s+$/, '')
    # Remove whitespace between tags
    html = html.replace(/\/(\w+)\>\s+\</g, (match) ->
      return match.replace(/\s+/, '')
    )
    # Standardize br
    html = html.replace(/<br><\/br>/, '<br/>')
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
