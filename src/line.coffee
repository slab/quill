#= require underscore

class TandemLine
  @CLASS_NAME : 'tandem-line'
  @ID_PREFIX  : 'tandem-line-'

  @isLineNode: (node) ->
    return node.className == TandemLine.CLASS_NAME


  constructor: (@doc, @node, @id, @index) ->
    @leaves = []
    @numLeaves = 0
    @attributes = {}
    this.normalizeHTML()
    this.buildLeaves(@node, @attributes)
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML

  buildLeaves: (node, attributes) ->
    _.each(node.childNodes, (node) =>
      nodeAttributes = _.clone(attributes)
      [attr, value] = Tandem.Leaf.getAttribute(node)
      nodeAttributes[attr] = value if attr?
      if node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE
        @leaves.push(new Tandem.Leaf(this, node, nodeAttributes, @numLeaves))
        @numLeaves += 1
      else
        this.buildLeaves(node, nodeAttributes)
    )

  findLeaf: (leafNode) ->
    for leaf in @leaves when leaf.node == leafNode
      return leaf
    return null

  getNextLine: ->
    return @doc.lines[@index + 1]

  getPrevLine: ->
    return @doc.lines[@index - 1]

  normalizeHTML: ->



window.Tandem ||= {}
window.Tandem.Line = TandemLine
