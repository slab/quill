Parchment = require('parchment')


class Document extends Parchment.Container
  constructor: (domNode, @options) ->
    super(domNode)
    @delta = this.getDelta()

  getDelta: ->
    return @children.reduce((delta, child) ->
      return delta.concat(child.delta)  # TODO child.getDelta()?
    , new Delta())

  observerHandler: (mutations) ->
    super(mutations)
    delta = convert(mutations)
    @options.onUpdate(delta)

  update: (source) ->
    @updates = super()
    # create delta
    delta = new Delta()
    this.onUpdate(delta)


module.exports = Document
