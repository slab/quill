Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


class Editor extends Parchment.Root
  constructor: (domNode, @options) ->
    super(domNode)
    this.ensureNewline()
    @delta = this.getDelta()
    @observer = new MutationObserver(this.update.bind(this))

  deleteAt: (index, length) ->
    super(index, length)
    ensureNewline()

  ensureNewline: ->
    if this.getLength() == 0
      this.appendChild(Parchment.create('block'))

  getDelta: ->
    return @children.reduce((delta, child) =>
      return delta.concat(child.getDelta())
    , new Delta())

  onUpdate: (delta) ->

  update: ->


module.exports = Editor
