Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


class Document extends Parchment.Root
  constructor: (domNode, @options) ->
    super(domNode)
    @delta = this.getDelta()
    @timer = setInterval(this.update.bind(this), @options.pollInterval)

  getDelta: ->
    return @children.reduce((delta, child) ->
      return delta.concat(child.getDelta())
    , new Delta())

  update: ->


module.exports = Document
