Scribe = require('./scribe')


class Scribe.Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @isLeafNode: (node) ->
    return false unless node?.nodeType == node.ELEMENT_NODE
    return true if node.tagName == 'BR'
    return true if node.childNodes.length == 1 && node.childNodes[0].nodeType == node.TEXT_NODE
    return false

  @isLeafParent: (node) ->
    return false unless node?.nodeType == node.ELEMENT_NODE
    return false if node.childNodes.length == 0
    return node.childNodes.length > 1 or node.childNodes[0].nodeType != node.TEXT_NODE

  constructor: (@line, @node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Scribe.Leaf.ID_PREFIX)
    @node.textContent = "" if @node.tagName == 'BR'
    @text = @node.textContent
    @length = @text.length

  getFormats: ->
    return _.extend(@formats, @line.formats)

  getLineOffset: ->
    return Scribe.Position.getIndex(@node, 0, @line.node)

  insertText: (index, text) ->
    @text = @text.substring(0, index) + text + @text.substring(index)
    [textNode, offset] = Scribe.DOM.findDeepestNode(@node, index)
    textNode.textContent = textNode.textContent.substring(0, offset) + text + textNode.textContent.substring(offset)
    @length = @text.length


module.exports = Scribe
