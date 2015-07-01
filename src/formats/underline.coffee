Parchment = require('parchment')

class Underline extends Parchment.Inline
  @nodeName: 'underline'
  @tagName: 'U'

Parchment.define(Underline)

module.exports = Underline
