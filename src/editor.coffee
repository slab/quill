Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


class Editor extends Parchment.Root
  constructor: (domNode) ->
    super(domNode)
    this.ensureNewline()
    this.enable()
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

  enable: (enabled = true) ->
    @domNode.setAttribute('contenteditable', enabled)

  ensureNewline: ->
    if this.getLength() == 0
      this.appendChild(Parchment.create('block'))

  findPath: (index) ->
    if index >= this.getLength()
      return []
    else
      return super(index)

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
    return new Delta()


module.exports = Editor
