_               = require('underscore')
ScribeDOM       = require('./dom')
ScribePosition  = require('./position')
ScribeUtils     = require('./utils')


class ScribeLeaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return false unless node?.nodeType == ScribeDOM.ELEMENT_NODE
    return true if node.tagName == 'BR'
    return true if node.childNodes.length == 1 and node.firstChild.nodeType == ScribeDOM.TEXT_NODE
    return false

  @isLeafParent: (node) ->
    return false unless node?.nodeType == ScribeDOM.ELEMENT_NODE
    return false if node.childNodes.length == 0
    return true if node.childNodes.length > 1 or node.firstChild.nodeType != ScribeDOM.TEXT_NODE
    return false

  constructor: (@line, @node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(ScribeLeaf.ID_PREFIX)
    @text = ScribeDOM.getText(@node)
    @length = @text.length

  getFormats: ->
    return _.extend({}, @formats, @line.formats)

  getLineOffset: ->
    return ScribePosition.getIndex(@node, 0, @line.node)

  insertText: (index, text) ->
    @text = @text.substring(0, index) + text + @text.substring(index)
    [textNode, offset] = ScribeUtils.findDeepestNode(@node, index)
    nodeText = ScribeDOM.getText(textNode)
    ScribeDOM.setText(textNode, nodeText.substring(0, offset) + text + nodeText.substring(offset))
    @length = @text.length


module.exports = ScribeLeaf
