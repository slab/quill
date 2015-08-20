Parchment = require('parchment')


class BlockAttributor extends Parchment.Style
  add: (node, value) ->
    blot = Parchment.findBlot(node)
    return unless blot? and blot instanceof Parchment.Block
    super(node, value)


module.exports =
  Align: Parchment.define(new BlockAttributor('align', 'textAlign'))
