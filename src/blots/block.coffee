_         = require('lodash')
Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')

NEWLINE_LENGTH = 1

class Block extends Parchment.Block
  @blotName = 'block'
  @tagName = 'P'

  build: ->
    super()
    this.ensureChild()

  deleteAt: (index, length) ->
    super(index, length)
    this.ensureChild()

  ensureChild: ->
    if this.children.length == 0
      this.appendChild(Parchment.create('break'))

  findPath: (index) ->
    return super(index, true)

  format: (name, value) ->
    if Parchment.match(name, Parchment.types.BLOT)?.prototype instanceof Parchment.Block ||
       Parchment.match(name, Parchment.types.ATTRIBUTE)
      super(name, value)

  formatAt: (index, length, name, value) ->
    if index + length >= this.getLength() and length > 0
      this.format(name, value)
    super(index, length, name, value)

  getDelta: ->
    leaves = this.getDescendants(Parchment.Leaf)
    return leaves.reduceRight((delta, leaf) =>
      return delta if leaf.getLength() == 0
      attributes = {}
      value = leaf.getValue()
      while (leaf != this)
        attributes = _.extend(leaf.getFormat(), attributes)
        leaf = leaf.parent
      return new Delta().insert(value, attributes).concat(delta)
    , new Delta().insert('\n', this.getFormat()))

  getLength: ->
    return super() + NEWLINE_LENGTH

  getValue: ->
    return super().concat(['\n'])

  insertAt: (index, value, def) ->
    return super(index, value, def) if def?
    return if value.length == 0
    lines = value.split('\n')
    text = lines.shift()
    super(index, text)
    if (lines.length > 0)
      next = this.split(index + text.length, true)
      next.insertAt(0, lines.join('\n'))

  insertBefore: (blot, ref) ->
    if @children.head? && @children.head.statics.blotName == 'break'
      br = @children.head
    super(blot, ref)
    br.remove() if br?


Parchment.define(Block)

module.exports = Block
