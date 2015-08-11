_         = require('lodash')
Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')

NEWLINE_LENGTH = 1

class Block extends Parchment.Block
  @blotName = 'block'
  @tagName = 'P'

  constructor: (value) ->
    super(value)
    this.ensureBreak()

  deleteAt: (index, length) ->
    if (index + length == this.getLength() and this.next?)
      this.next.moveChildren(this)
      length -= NEWLINE_LENGTH
    super(index, length)
    this.ensureBreak()

  formatAt: (index, length, name, value) ->
    if index + length >= this.getLength() and length > 0
      this.format(name, value)
    super(index, length, name, value)

  ensureBreak: ->
    if this.getLength() == NEWLINE_LENGTH
      this.appendChild(Parchment.create('break'))

  getDelta: ->
    formats = this.getFormat()
    values = this.getValue()
    return values.reduce((delta, value, index) ->
      delta.insert(value, formats[index])
    , new Delta())

  getFormat: ->
    thisFormat = super()
    collector = (blot) ->
      format = blot.getFormat() || {}
      if (blot instanceof Parchment.Parent)
        return blot.children.reduce((memo, child) ->
          return memo.concat(collector(child))
        , []).map((childFormat) ->
          return _.defaults(format, childFormat)
        )
      else
        return [format]
    return @children.reduce((memo, child) ->
      return memo.concat(collector(child))
    , []).concat([thisFormat])

  getLength: ->
    return super() + NEWLINE_LENGTH

  getValue: ->
    return super().concat(['\n'])

  insertAt: (index, value, def) ->
    return super(index, value, def) if def?
    return if value.length == 0
    lines = value.split('\n')
    text = lines.shift()
    this.insertAt(index, text)
    if (lines.length > 0)
      next = this.split(index + text.length, true)
      next.insertAt(0, lines.join('\n'))

  insertBefore: (blot, ref) ->
    if this.children.head? && this.children.head.statics.blotName == 'break'
      br = this.children.head
    super(blot, ref)
    br.remove() if br?


Parchment.define(Block)

module.exports = Block
