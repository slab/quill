Parchment = require('parchment')

Link = Parchment.define({
  nodeName: 'link'
  tagName: 'A'
  init: (value) ->
    this.domNode.href = value
  formats: ->
    return [this.domNode.href]
}, Parchment.Inline)

module.exports = Link
