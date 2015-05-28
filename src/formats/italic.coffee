Parchment = require('parchment')

Italic = Parchment.define({
  nodeName: 'italic'
  tagName: 'EM'
}, Parchment.Inline)

module.exports = Italic
