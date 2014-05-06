_          = require('lodash')
DOM        = require('./dom')
Format     = require('./format')
LinkedList = require('./lib/linked-list')
Utils      = require('./utils')


class Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return DOM.isTextNode(node) or !node.firstChild?

  constructor: (@node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Leaf.ID_PREFIX)
    @text = DOM.getText(@node)
    @length = @text.length

  getFormats: ->
    return @formats

  deleteText: (offset, length) ->
    @text = @text.slice(0, offset) + @text.slice(offset + length)
    @length = @text.length
    targetNode = @node.firstChild or @node
    DOM.setText(targetNode, @text)

  insertText: (offset, text) ->
    @text = @text.slice(0, offset) + text + @text.slice(offset)
    if DOM.isTextNode(@node)
      DOM.setText(@node, @text)
    else
      textNode = @node.ownerDocument.createTextNode(text)
      if @node.tagName == DOM.DEFAULT_BREAK_TAG
        DOM.replaceNode(textNode, @node)
      else
        @node.appendChild(textNode)
      @node = textNode
    @length = @text.length


module.exports = Leaf
