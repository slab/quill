Parchment = require('parchment')


class Image extends Parchment.Embed
  @nodeName: 'image'
  @tagName: 'IMG'

  init: (value) ->
    this.domNode.setAttribute('src', value.src)
    this.domNode.setAttribute('alt', value.alt) if value.alt?

  values: ->
    value =
      type: this.statics.nodeName
      src: this.domNode.getAttribute('src')
    if this.domNode.hasAttribute('alt')
      value.alt = this.domNode.getAttribute('alt')
    return value


Parchment.define(Image)

module.exports = Image
