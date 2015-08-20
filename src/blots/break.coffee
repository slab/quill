Parchment = require('parchment')

class Break extends Parchment.Embed
  @blotName = 'break'
  @tagName = 'BR'

  getLength: ->
    return 0

  getValue: ->
    return ''


Parchment.define(Break)

module.exports = Break
