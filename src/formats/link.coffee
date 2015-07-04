Parchment = require('parchment')

class Link extends Parchment.Inline
  @blotName: 'link'
  @tagName: 'A'

  constructor: (value) ->
    super(value)
    @domNode.href = value

  formats: ->
    return [this.domNode.href]


Parchment.define(Link)

module.exports = Link
