Scribe = require('./scribe')


class Scribe.Leaf extends LinkedList.Node
  @ID_PREFIX: 'leaf-'

  @DEFAULT_FORMATS:
    'background' : 'white'
    'color'      : 'black'
    'family'     : 'san-serif'
    'size'       : 'normal'

  @FORMATS: {
    'author'
    'bold'
    'background'
    'color'
    'family'
    'italic'
    'link'
    'size'
    'strike'
    'underline' 
  }

  @SPAN_FORMATS:
    'author'     : ['0', '1']    # Dummy values so we are an array
    'background' : ['black', 'blue', 'green', 'orange', 'purple', 'red', 'white', 'yellow']
    'color'      : ['black', 'blue', 'green', 'orange', 'purple', 'red', 'white', 'yellow']
    'family'     : ['monospace', 'serif']
    'size'       : ['huge', 'large', 'small']

  @TAG_FORMATS:
    'bold'      : [true, false]
    'italic'    : [true, false]
    'link'      : [true, false] # Link value could actually also be any string representing the href
    'strike'    : [true, false]
    'underline' : [true, false]


  @isLeafNode: (node) ->
    return false unless node?.nodeType == node.ELEMENT_NODE
    return false unless Scribe.DOM.canEdit(node)
    return true if node.tagName == 'BR'
    childNodes = Scribe.DOM.filterUneditable(node.childNodes)
    return true if childNodes.length == 1 && childNodes[0].nodeType == node.TEXT_NODE
    return false

  @isLeafParent: (node) ->
    return false unless node?.nodeType == node.ELEMENT_NODE
    return false unless Scribe.DOM.canEdit(node)
    childNodes = Scribe.DOM.filterUneditable(node.childNodes)
    return false if childNodes.length == 0
    return childNodes.length > 1 or childNodes[0].nodeType != node.TEXT_NODE

  constructor: (@line, @node, formats) ->
    @formats = _.clone(formats)
    @id = _.uniqueId(Scribe.Leaf.ID_PREFIX)
    @node.textContent = "" if @node.tagName == 'BR'
    @text = @node.textContent
    @length = @text.length

  getFormats: (excludeDefault = false) ->
    formats = if excludeDefault then {} else _.clone(Scribe.Leaf.DEFAULT_FORMATS)
    return _.extend(formats, @formats, @line.formats)

  getLineOffset: ->
    return Scribe.Position.getIndex(@node, 0, @line.node)

  insertText: (index, text) ->
    @text = @text.substring(0, index) + text + @text.substring(index)
    [textNode, offset] = Scribe.DOM.findDeepestNode(@node, index)
    textNode.textContent = textNode.textContent.substring(0, offset) + text + textNode.textContent.substring(offset)
    @length = @text.length


module.exports = Scribe
