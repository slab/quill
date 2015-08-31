_         = require('lodash')
Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
Block     = require('../blots/block')


class List extends Parchment.Block
  @blotName: 'list'
  @tagName: 'OL'

  format: (name, value) ->
    console.log('I have to deal...')
    debugger
    super(name, value)

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

  merge: (target = this.next) ->
    return false
    console.log(@parent.domNode.outerHTML)
    if target? && this.statics.blotName == target.statics.blotName   # OL/UL should not have DOM attributes
      console.trace()
      console.log('yes', this.domNode.outerHTML, target.domNode.outerHTML)
      target.moveChildren(this)
      console.log('after', this.domNode.outerHTML, target.domNode.outerHTML)
      target.remove()
      # this.merge()
    return false


###
  - Intercept format
  - Intercept replace
###


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
