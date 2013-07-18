Scribe = require('./scribe')


class Scribe.Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return false unless node?.nodeType == Scribe.DOM.ELEMENT_NODE
    return true if node.tagName == 'BR'
    return true if node.childNodes.length == 1 and node.firstChild.nodeType == Scribe.DOM.TEXT_NODE
    return false

  @isLeafParent: (node) ->
    return false unless node?.nodeType == Scribe.DOM.ELEMENT_NODE
    return false if node.childNodes.length == 0
    return true if node.childNodes.length > 1 or node.firstChild.nodeType != Scribe.DOM.TEXT_NODE
    return false

  constructor: (@line, @node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Scribe.Leaf.ID_PREFIX)
    @text = Scribe.DOM.getText(@node)
    @length = @text.length

  getFormats: ->
    return _.extend(@formats, @line.formats)

  getLineOffset: ->
    return Scribe.Position.getIndex(@node, 0, @line.node)

  insertText: (index, text) ->
    @text = @text.substring(0, index) + text + @text.substring(index)
    [textNode, offset] = Scribe.DOM.findDeepestNode(@node, index)
    nodeText = Scribe.DOM.getText(textNode)
    Scribe.DOM.setText(textNode, nodeText.substring(0, offset) + text + nodeText.substring(offset))
    @length = @text.length


module.exports = Scribe
