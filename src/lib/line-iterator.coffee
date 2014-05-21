DOM = require('../dom')


class LineIterator
  constructor: (@root) ->
    @lineNode = @root.firstChild
    if @lineNode? and DOM.LIST_TAGS[@lineNode.tagName]?
      @lineNode = @lineNode.firstChild

  next: ->
    return null unless @lineNode?
    retNode = @lineNode
    @lineNode = @lineNode.nextSibling
    if !@lineNode?
      if @root != retNode.parentNode
        @lineNode = retNode.parentNode.nextSibling
      else
        return retNode
    if @lineNode? and DOM.LIST_TAGS[@lineNode.tagName]
      @lineNode = @lineNode.firstChild
    return retNode


module.exports = LineIterator
