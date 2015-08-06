Parchment = require('parchment')

class Italic extends Parchment.Inline
  @blotName: 'italic'
  @tagName: 'EM'

Parchment.define(Italic)

module.exports = Italic
