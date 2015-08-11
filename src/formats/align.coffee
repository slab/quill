Parchment = require('parchment')


class BlockAttributor extends Parchment.Style
  add: (node, value) ->
    blot = Parchment.findBlot(node)
    return unless blot? and blot instanceof Parchment.Block
    super(node, value)


Align = new BlockAttributor('align', 'textAlign')

module.exports = Parchment.define(Align)
