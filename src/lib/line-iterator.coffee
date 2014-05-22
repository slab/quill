DOM = require('../dom')


class LineIterator
  constructor: (@root) ->

  next: ->
    return null unless @root?
    nextNode = if @lineNode then @lineNode.nextSibling else @root.firstChild
    if !nextNode? and @lineNode? and @lineNode.parentNode != @root
      nextNode = @lineNode.parentNode.nextSibling
    if nextNode? and DOM.LIST_TAGS[nextNode.tagName]?
      nextNode = nextNode.firstChild
    @root = null unless nextNode?
    @lineNode = nextNode
    return @lineNode


module.exports = LineIterator
