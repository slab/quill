#= require underscore

class TandemLine
  @CLASS_NAME: 'line'

  constructor: (@node, @id, @index) ->
    @leaves = []
    @numLeaves = 0
    this.normalizeHTML()
    this.buildLeaves(@node, {})
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML

  buildLeaves: (node, attributes) ->
    _.each(node.childNodes, (node) =>
      nodeAttributes = _.clone(attributes)
      [attr, value] = Tandem.Leaf.getAttribute(node)
      nodeAttributes[attr] = value if attr?
      if node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE
        @leaves.push(new Tandem.Leaf(node, nodeAttributes, @numLeaves))
        @numLeaves += 1
      else
        this.buildLeaves(node, nodeAttributes)
    )

  normalizeHTML: ->




window.Tandem ||= {}
window.Tandem.Line = TandemLine
