Parchment = require('parchment')

Italic = Parchment.define({
  nodeName: 'italic'
  tagName: 'EM'
}, Parchment.InlineNode)

module.exports = Italic
