Parchment = require('parchment')


class Image extends Parchment.Embed
  @blotName: 'image'
  @tagName: 'IMG'

  init: (value) ->
    this.domNode.setAttribute('src', value.src)
    this.domNode.setAttribute('alt', value.alt) if value.alt?

  formats: ->
    format = super()
    format.src = this.domNode.getAttribute('src')

  values: ->
    return 1  # Quill embed type


Parchment.define(Image)

module.exports = Image
