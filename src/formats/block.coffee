Parchment = require('parchment')
StyleAttributor = require('./attributor')


class BlockAttributor extends StyleAttributor
  add: (node, value) ->
    blot = Parchment.findBlot(node)
    return unless blot? and blot instanceof Parchment.Block
    super(node, value)


Align = new BlockAttributor('align', 'text-align', {
  default: 'left'
  whitelist: ['left', 'right', 'center', 'justify']
})

Direction = new BlockAttributor('direction', 'direction', {
  default: 'ltr'
  whitelist: ['ltr', 'rtl']
})


module.exports =
  Align: Parchment.register(Align)
  Direction: Parchment.register(Direction)
