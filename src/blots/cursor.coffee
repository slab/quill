Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


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


Parchment.register(Cursor)
Parchment.register(Parchment.Inline)   # Redefine to overwrite cursor

module.exports = Cursor
