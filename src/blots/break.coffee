Parchment = require('parchment')

class Break extends Parchment.Embed
  @blotName = 'break'
  @tagName = 'BR'

  getLength: ->
    return 0

  getValue: ->
    return ''


Parchment.register(Break)

module.exports = Break
