_          = require('lodash')
dom        = require('../lib/dom')
Format     = require('./format')
LinkedList = require('../lib/linked-list')


class Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return dom(node).isTextNode() or !node.firstChild?

  constructor: (@node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Leaf.ID_PREFIX)
    @text = dom(@node).text()
    @length = @text.length

  deleteText: (offset, length) ->
    return unless length > 0
    @text = @text.slice(0, offset) + @text.slice(offset + length)
    @length = @text.length
    if dom.EMBED_TAGS[@node.tagName]?
      textNode = document.createTextNode(@text)
      @node = dom(@node).replace(textNode)
    else
      dom(@node).text(@text)

  insertText: (offset, text) ->
    @text = @text.slice(0, offset) + text + @text.slice(offset)
    if dom(@node).isTextNode()
      dom(@node).text(@text)
    else
      textNode = document.createTextNode(text)
      if @node.tagName == dom.DEFAULT_BREAK_TAG
        @node = dom(@node).replace(textNode)
      else
        @node.appendChild(textNode)
        @node = textNode
    @length = @text.length


module.exports = Leaf
