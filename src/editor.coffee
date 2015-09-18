Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')


class Editor extends Parchment.Container
  constructor: (domNode) ->
    super(domNode)
    this.ensureChild()
    this.enable()
    @delta = this.getDelta()
    @observer = new MutationObserver((mutations) =>
      this.update(mutations)  # Do not pass additional params from MutationObserver handler
    )
    @observer.observe(@domNode,
      attributes: true
      characterData: true
      childList: true
      subtree: true
    )

  deleteAt: (index, length) ->
    [first, firstOffset] = @children.find(index)
    [last, lastOffset] = @children.find(index + length)
    super(index, length)
    if last? && first != last && firstOffset > 0
      lastChild = first.children.tail
      last.moveChildren(first)
      last.remove()
      lastChild.merge() if lastChild?
    this.ensureChild()

  enable: (enabled = true) ->
    @domNode.setAttribute('contenteditable', enabled)

  ensureChild: ->
    if @children.length == 0
      this.appendChild(Parchment.create('block'))

  findPath: (index) ->
    if index >= this.getLength()
      return []
    else
      return super(index).slice(1)

  getDelta: ->
    return this.getLines().reduce((delta, child) =>
      return delta.concat(child.getDelta())
    , new Delta())

  getLines: (index = 0, length = this.getLength()) ->
    return this.getDescendants(index, length, Parchment.Block)

  onUpdate: (delta) ->

  # Prevent document removal
  remove: ->
    @children.forEach((child) ->
      child.remove()
    )

  update: (args...) ->
    if Array.isArray(args[0])
      mutations = args[0]
      args = args.slice(1)
    else
      mutations = @observer.takeRecords()
    return new Delta() unless mutations.length > 0
    oldDelta = @delta
    # TODO optimize
    this.build()
    @delta = this.getDelta()
    change = oldDelta.diff(@delta)
    this.onUpdate(change, args...) if change.length() > 0
    @observer.takeRecords()  # Prevent changes from rebuilds
    return change


module.exports = Editor
