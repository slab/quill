#= require underscore

class TandemLeaf
  @groupByLine: (leaves) ->
    return _.reduce(leaves, (lines, leaf) ->
      if !lines[leaf.line.id]?
        lines[leaf.line.id] = []
      lines[leaf.line.id].push(leaf)
    , {})

  @isLeafNode: (node) ->
    return node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE || node.tagName == 'BR'


  constructor: (@line, @node, @attributes) ->
    @text = @node.textContent
    @length = @text.length

  setText: (@text) ->
    @node.textContent = @text
    @length = @text.length
    @line.resetContent()



window.Tandem ||= {}
window.Tandem.Leaf = TandemLeaf
