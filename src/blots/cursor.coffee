Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
dom       = require('../lib/dom')


class Cursor extends Parchment.Embed
  @blotName = 'cursor'
  @tagName = 'span'

  constructor: (value) ->
    super(value)
    dom(this.domNode).addClass(Parchment.PREFIX + 'cursor')
    this.domNode.appendChild(document.createTextNode(dom.ZERO_WIDTH_NOBREAK_SPACE))

  getLength: ->
    return 0

  getValue: ->
    return ''


Parchment.define(Cursor)
Parchment.define(Parchment.Inline)   # Redefine to overwrite cursor

module.exports = Cursor
