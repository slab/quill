Parchment = require('parchment')

class Underline extends Parchment.Inline
  @blotName: 'underline'
  @tagName: 'U'

Parchment.define(Underline)

module.exports = Underline
