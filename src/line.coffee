#= require underscore

class TandemLine
  @CLASS_NAME : 'tandem-line'
  @ID_PREFIX  : 'tandem-line-'
  @counter    : 0

  @isLineNode: (node) ->
    return node.classList.contains(TandemLine.CLASS_NAME)


  constructor: (@doc, @node, @index) ->
    @node.id = @id = TandemLine.ID_PREFIX + TandemLine.counter
    @node.classList.add(TandemLine.CLASS_NAME)
    TandemLine.counter += 1
    this.rebuild()

  buildLeaves: (node, attributes) ->
    _.each(node.childNodes, (node) =>
      nodeAttributes = _.clone(attributes)
      attr = Tandem.Utils.getAttributeForContainer(node)
      nodeAttributes[attr] = true if attr?
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

  normalizeHtml: ->

  rebuild: ->
    @leaves = []
    @numLeaves = 0
    @attributes = {}
    this.normalizeHtml()
    this.buildLeaves(@node, @attributes)
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML



window.Tandem ||= {}
window.Tandem.Line = TandemLine
