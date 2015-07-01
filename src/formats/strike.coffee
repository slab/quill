Parchment = require('parchment')

class Strike extends Parchment.Inline
  @nodeName: 'strike'
  @tagName: 'S'

Parchment.define(Strike)

module.exports = Strike
