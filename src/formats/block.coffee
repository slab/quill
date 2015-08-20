Parchment = require('parchment')
StyleAttributor = require('./attributor')


class BlockAttributor extends StyleAttributor
  add: (node, value) ->
    blot = Parchment.findBlot(node)
    return unless blot? and blot instanceof Parchment.Block
    super(node, value)


Align = new BlockAttributor('align', 'textAlign', {
  default: 'left'
  whitelist: ['left', 'right', 'center', 'justify']
})


module.exports =
  Align: Parchment.define(Align)
