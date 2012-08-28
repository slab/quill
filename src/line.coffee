#= require underscore
#= require linked_list

class TandemLine extends LinkedList.Node
  @CLASS_NAME : 'tandem-line'
  @ID_PREFIX  : 'tandem-line-'
  @counter    : 0

  @isLineNode: (node) ->
    return node.classList.contains(TandemLine.CLASS_NAME)


  constructor: (@doc, @node) ->
    @node.id = @id = TandemLine.ID_PREFIX + TandemLine.counter
    @node.classList.add(TandemLine.CLASS_NAME)
    TandemLine.counter += 1
    this.rebuild()
    super(@node)

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

  normalizeHtml: ->
    this.mergeAdjacent()
    this.wrapText()
    # Combine adjacent nodes with same tagname

  rebuild: ->
    @leaves = []
    @numLeaves = 0
    @attributes = {}
    this.normalizeHtml()
    this.buildLeaves(@node, @attributes)
    this.resetContent()

  resetContent: ->
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML


  mergeAdjacent: (node = @node.firstChild) ->
    while node? && node.nextSibling?
      next = node.nextSibling
      if Tandem.Utils.getAttributeForContainer(node) == Tandem.Utils.getAttributeForContainer(next)
        node = Tandem.Utils.Node.mergeNodes(node, next)
      else
        node = next
        _.each(_.clone(node.childNodes), (childNode) =>
          this.mergeAdjacent(node)
        )

  wrapText: ->
    Tandem.Utils.Node.traverseDeep(@node, (node) ->
      if node.nodeType == node.TEXT_NODE && node.nextSibling?
        Tandem.Utils.Node.wrap(node.ownerDocument.createElement('span'), node)
    )



window.Tandem ||= {}
window.Tandem.Line = TandemLine
