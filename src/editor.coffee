Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


class Editor extends Parchment.Root
  constructor: (domNode, @options) ->
    super(domNode)
    this.ensureNewline()
    @delta = this.getDelta()
    @observer = new MutationObserver(this.update.bind(this))

  deleteAt: (index, length) ->
    [first, offset] = this.children.find(index)
    [last, offset] = this.children.find(index + length)
    super(index, length)
    if (last? && first != last)
      lastChild = first.children.tail
      last.moveChildren(first)
      last.remove()
      lastChild.merge() if lastChild?
    this.ensureNewline()

  ensureNewline: ->
    if this.getLength() == 0
      this.appendChild(Parchment.create('block'))

  getDelta: ->
    return @children.reduce((delta, child) =>
      return delta.concat(child.getDelta())
    , new Delta())

  onUpdate: (delta) ->

  remove: ->
    this.children.forEach((child) ->
      child.remove()
    )

  update: ->


module.exports = Editor
