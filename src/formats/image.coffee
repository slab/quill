Parchment = require('parchment')


class Image extends Parchment.Embed
  @blotName: 'image'
  @tagName: 'IMG'

  constructor: (value) ->
    super(value)
    @domNode.setAttribute('src', value) if typeof value == 'string'

  getFormat: ->
    format = super()
    format.image = @domNode.getAttribute('src')
    return format

  getValue: ->
    return 1  # Quill embed type


Parchment.define(Image)

module.exports = Image
