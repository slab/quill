_          = require('lodash')
LinkedList = require('linked-list')
DOM        = require('./dom')
Utils      = require('./utils')


class Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return false unless node?.nodeType == DOM.ELEMENT_NODE
    return true if node.tagName == 'BR'
    return true if node.tagName == 'SPAN' and !node.firstChild?
    return true if node.childNodes.length == 1 and node.firstChild.nodeType == DOM.TEXT_NODE
    return false

  @isLeafParent: (node) ->
    return false unless node?.nodeType == DOM.ELEMENT_NODE
    return false if node.childNodes.length == 0
    return true if node.childNodes.length > 1 or node.firstChild.nodeType != DOM.TEXT_NODE
    return false

  constructor: (@line, @node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Leaf.ID_PREFIX)
    @text = DOM.getText(@node)
    @length = @text.length

  getFormats: ->
    return @formats

  insertText: (index, text) ->
    @text = @text.substring(0, index) + text + @text.substring(index)
    [textNode, offset] = Utils.findDeepestNode(@node, index)
    nodeText = DOM.getText(textNode)
    DOM.setText(textNode, nodeText.substring(0, offset) + text + nodeText.substring(offset))
    @length = @text.length


module.exports = Leaf
