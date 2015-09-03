Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
dom       = require('../lib/dom')


class Cursor extends Parchment.Embed
  @blotName = 'cursor'
  @tagName = 'span'

  constructor: (value) ->
    super(value)
    this.domNode.classList.add(Parchment.PREFIX + 'cursor')
    this.domNode.appendChild(document.createTextNode("\uFEFF"))   # Zero width space

  getLength: ->
    return 0

  getValue: ->
    return ''


Parchment.define(Cursor)
Parchment.define(Parchment.Inline)   # Redefine to overwrite cursor

module.exports = Cursor
