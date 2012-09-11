#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/tags

class TandemLine extends LinkedList.Node
  @CLASS_NAME : 'tandem-line'
  @ID_PREFIX  : 'tandem-line-'
  @counter    : 0

  @isLineNode: (node) ->
    return node? && node.classList? && node.classList.contains(TandemLine.CLASS_NAME)


  constructor: (@doc, @node) ->
    @id = TandemLine.ID_PREFIX + TandemLine.counter
    @node.id = @id
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
        @leaves.append(new Tandem.Leaf(this, node, nodeAttributes, @numLeaves))
        @numLeaves += 1
      else
        this.buildLeaves(node, nodeAttributes)
    )

  applyRules: ->
    Tandem.Utils.traversePreorder(@node, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE
        rules = Tandem.Tags.LINE_RULES[node.tagName]
        if rules?
          _.each(rules, (data, rule) ->
            switch rule
              when 'rename' then node = Tandem.Utils.switchTag(node, data)
              else return
          )
        else
          node = Tandem.Utils.unwrap(node)
      return node
    )

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  normalizeHtml: ->
    return if @node.childNodes.length == 1 && @node.firstChild.tagName == 'BR'
    this.applyRules()
    this.removeRedundant()
    this.mergeAdjacent()
    this.wrapText()
    @node.appendChild(@node.ownerDocument.createElement('br')) if @node.firstChild == null

  splitContents: (offset) ->
    [node, offset] = Tandem.Utils.getChildAtOffset(@node, offset)
    return Tandem.Utils.splitNode(node, offset)

  toDelta: ->
    deltas = _.map(@leaves.toArray(), (leaf) ->
      return new JetInsert(leaf.text, leaf.attributes)
    )
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta


  rebuild: ->
    # TODO memory leak issue?
    @leaves = new LinkedList()
    @numLeaves = 0
    this.normalizeHtml()
    this.buildLeaves(@node, {})
    this.resetContent()

  resetContent: ->
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML
    @delta = this.toDelta()


  mergeAdjacent: (node = @node.firstChild) ->
    while node? && node.nextSibling?
      next = node.nextSibling
      if node.tagName == next.tagName && Tandem.Utils.getAttributeForContainer(node) == Tandem.Utils.getAttributeForContainer(next)
        node = Tandem.Utils.mergeNodes(node, next)
      else
        node = next
        _.each(_.clone(node.childNodes), (childNode) =>
          this.mergeAdjacent(node)
        )

  removeRedundant: ->
    @node._tandemAttributes = {}
    Tandem.Utils.traversePreorder(@node, 0, (node) ->
      if node.nodeType == node.ELEMENT_NODE && node.textContent.length == 0
        return Tandem.Utils.unwrap(node)
      if node.tagName == 'SPAN' && (node.childNodes.length == 0 || _.any(node.childNodes, (child) -> child.nodeType == child.ELEMENT_NODE))
        return Tandem.Utils.unwrap(node)
      attribute = Tandem.Utils.getAttributeForContainer(node)
      if attribute?
        if node.parentNode._tandemAttributes[attribute] == true
          return Tandem.Utils.unwrap(node)
        node._tandemAttributes = _.clone(node.parentNode._tandemAttributes)
        node._tandemAttributes[attribute] = true
      return node
    )
    delete @node._tandemAttributes
    Tandem.Utils.traversePreorder(@node, 0, (node) ->
      delete node._tandemAttributes
      return node
    )

  renameEquivalent: ->

  wrapText: ->
    Tandem.Utils.traversePreorder(@node, 0, (node) =>
      node.normalize()
      if node.nodeType == node.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == @node)
        span = node.ownerDocument.createElement('span')
        Tandem.Utils.wrap(span, node)
        node = span
      return node
    )


window.Tandem ||= {}
window.Tandem.Line = TandemLine
