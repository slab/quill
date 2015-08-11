_         = require('lodash')
Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
Block     = require('../blots/block')


class List extends Parchment.Parent
  @blotName: 'list'
  @tagName: 'OL'

  getDelta: ->
    return @children.reduce((delta, child) ->
      return delta.concat(child.getDelta())
    , new Delta())

  insertBefore: (child, refBlot) ->
    if (child instanceof Item)
      super(child, refBlot)
    else
      if !@children.head?
        this.appendChild(Parchment.create('item'))
      @children.head.insertBefore(child)

  # merge: (target = this.next) ->
  #   if !@parent then return false
  #   if target? && this.statics.blotName == target.statics.blotName   # OL/UL should not have DOM attributes
  #     console.trace()
  #     console.log('yes', this.domNode.outerHTML, target.domNode.outerHTML)
  #     target.moveChildren(this)
  #     console.log('after', this.domNode.outerHTML, target.domNode.outerHTML)
  #     # target.remove()
  #     return true
  #   return false


class Bullet extends List
  @blotName: 'bullet'
  @tagName: 'UL'


class Item extends Block
  @blotName: 'item'
  @tagName: 'LI'

  getFormat: ->
    format = super()
    _.last(format)[@parent.statics.blotName] = true
    return format


Parchment.define(Bullet)
Parchment.define(List)
Parchment.define(Item)

module.exports = List
