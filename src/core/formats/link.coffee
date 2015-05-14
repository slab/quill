Parchment = require('parchment')

Link = Parchment.define({
  nodeName: 'link'
  tagName: 'A'
  init: (value) ->
    a = document.createElement(this.statics.tagName)
    a.href = value
    return a
  formats: ->
    return [this.domNode.href]
}, Parchment.InlineNode)

module.exports = Link
