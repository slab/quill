Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


class Editor extends Parchment.Root
  constructor: (domNode, @options) ->
    super(domNode)
    @delta = this.getDelta()
    @observer = new MutationObserver(this.update.bind(this))

  getDelta: ->
    return @children.reduce((delta, child) =>
      return delta.concat(child.getDelta())
    , new Delta())

  onUpdate: (delta) ->

  update: ->


module.exports = Editor
