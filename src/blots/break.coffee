Parchment = require('parchment')

class Break extends Parchment.Embed
  @blotName = 'break'
  @tagName = 'BR'

  constructor: (value) ->
    @formats = {}
    super(value)

  getLength: ->
    return 0

  insertAt: (index, value, def) ->
    super(index, value, def)
    this.remove() if @prev? or @next?


Parchment.define(Break)

module.exports = Break
