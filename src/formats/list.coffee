_         = require('lodash')
Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
Block     = require('../blots/block')


class List extends Parchment.Container
  @blotName: 'list'
  @tagName: 'OL'

  insertBefore: (child, refBlot) ->
    if (child instanceof Item)
      super(child, refBlot)
    else
      if !@children.head?
        this.appendChild(Parchment.create('item'))
      @children.head.appendChild(child)
      if child instanceof Parchment.Block
        child.unwrap()

  merge: (target = this.next) ->
    if target? && this.statics.blotName == target.statics.blotName   # OL/UL should not have DOM attributes
      target.moveChildren(this)
      target.remove()
    return false


class Bullet extends List
  @blotName: 'bullet'
  @tagName: 'UL'


class Item extends Block
  @blotName: 'item'
  @tagName: 'LI'

  format: (name, value) ->
    if Parchment.match(name, Parchment.types.ATTRIBUTE)
      super(name, value)
    else
      name = 'block' unless value
      target = @parent.isolate(this.offset(), this.getLength())
      target.replace(name, value)
      this.unwrap() unless @parent instanceof List

  getFormat: ->
    format = super()
    delete format['item']
    format[@parent.statics.blotName] = true
    return format


Parchment.define(Bullet)
Parchment.define(List)
Parchment.define(Item)

module.exports = List
