Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
Block     = require('../blots/block')
dom       = require('../lib/dom')


class Header extends Block
  @blotName: 'header'
  @tagName: ['H1', 'H2', 'H3']

  constructor: (value) ->
    if typeof value == 'number'
      value = document.createElement(this.statics.tagName[(value-1)])
    super(value)

  getFormat: ->
    formats = super()
    formats.header = this.statics.tagName.indexOf(@domNode.tagName) + 1
    return formats


module.exports = Parchment.define(Header)
