#= require underscore
#= require linked_list
#= require jetsync

class TandemLine extends LinkedList.Node
  @CLASS_NAME : 'tandem-line'
  @ID_PREFIX  : 'tandem-line-'
  @counter    : 0

  @isLineNode: (node) ->
    return node? && node.classList? && node.classList.contains(TandemLine.CLASS_NAME)


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
      if Tandem.Leaf.isLeafNode(node)
        @leaves.push(new Tandem.Leaf(this, node, nodeAttributes, @numLeaves))
        @numLeaves += 1
      else
        this.buildLeaves(node, nodeAttributes)
    )

  breakBlocks: ->


  findLeaf: (leafNode) ->
    for leaf in @leaves when leaf.node == leafNode
      return leaf
    return null

  normalizeHtml: ->
    this.breakBlocks()
    this.renameEquivalent()
    this.mergeAdjacent()
    this.removeRedundant()
    this.wrapText()



  toDelta: ->
    deltas = _.map(@leaves, (leaf) ->
      return new JetInsert(leaf.text, leaf.attributes)
    )
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta


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
    @delta = this.toDelta()


  mergeAdjacent: (node = @node.firstChild) ->
    while node? && node.nextSibling?
      next = node.nextSibling
      if node.tagName == next.tagName && Tandem.Utils.getAttributeForContainer(node) == Tandem.Utils.getAttributeForContainer(next)
        node = Tandem.Utils.Node.mergeNodes(node, next)
      else
        node = next
        _.each(_.clone(node.childNodes), (childNode) =>
          this.mergeAdjacent(node)
        )

  removeRedundant: ->
    Tandem.Utils.Node.traverseDeep(@node, (node) ->
      if node.tagName == 'SPAN' && (node.childNodes.length == 0 || _.any(node.childNodes, (child) -> child.nodeType != child.TEXT_NODE))
        Tandem.Utils.Node.unwrap(node)
    )

  renameEquivalent: ->
    Tandem.Utils.Node.traverseDeep(@node, (node) ->

    )

  wrapText: ->
    Tandem.Utils.Node.traverseDeep(@node, (node) ->
      node.normalize()
      if node.nodeType == node.TEXT_NODE && node.nextSibling?
        Tandem.Utils.Node.wrap(node.ownerDocument.createElement('span'), node)
    )



window.Tandem ||= {}
window.Tandem.Line = TandemLine
