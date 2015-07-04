Parchment = require('parchment')

class Strike extends Parchment.Inline
  @blotName: 'strike'
  @tagName: 'S'

Parchment.define(Strike)

module.exports = Strike
