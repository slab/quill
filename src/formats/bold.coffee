Parchment = require('parchment')

class Bold extends Parchment.Inline
  @blotName: 'bold'
  @tagName: 'STRONG'

Parchment.define(Bold)

module.exports = Bold
