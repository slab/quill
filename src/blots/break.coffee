Parchment = require('parchment')

class Break extends Parchment.Embed
  @blotName = 'break'
  @tagName = 'BR'

  getLength: ->
    return 0

  getValue: ->
    return ''

  insertAt: (index, value, def) ->
    super(index, value, def)
    this.remove() if @prev? or @next?


Parchment.define(Break)

module.exports = Break
