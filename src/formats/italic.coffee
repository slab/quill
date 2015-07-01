Parchment = require('parchment')

class Italic extends Parchment.Inline
  @nodeName: 'italic'
  @tagName: 'EM'

Parchment.define(Italic);

module.exports = Italic
