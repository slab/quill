Parchment = require('parchment')

class Bold extends Parchment.Inline
  @nodeName: 'bold'
  @tagName: 'STRONG'

Bold = Parchment.define(Bold)

module.exports = Bold
