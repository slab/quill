_          = require('lodash')
LinkedList = require('linked-list')
DOM        = require('./dom')
Utils      = require('./utils')


class Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return false unless DOM.isElement(node)
    return true if !node.firstChild?
    return true if node.childNodes.length == 1 and DOM.isTextNode(node.firstChild)
    return false

  constructor: (@node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Leaf.ID_PREFIX)
    @text = DOM.getText(@node)
    @length = @text.length

  getFormats: ->
    return @formats

  insertText: (index, text) ->
    @text = @text.slice(0, index) + text + @text.slice(index)
    @node = DOM.switchTag(@node, 'span') if @node.tagName == 'BR'
    targetNode = @node.firstChild or @node
    DOM.setText(targetNode, @text)
    @length = @text.length


module.exports = Leaf
