#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/tags

class TandemLine extends LinkedList.Node
  @CLASS_NAME : 'tandem-line'
  @DIRTY_CLASS: 'tandem-dirty'
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


  mergeAdjacent: ->
    Tandem.Utils.traversePreorder(@node, 0, (node) ->
      if node.nodeType == node.ELEMENT_NODE && !TandemLine.isLineNode(node)
        next = node.nextSibling
        if next? && node.tagName == next.tagName && node.className == next.className
          node = Tandem.Utils.mergeNodes(node, next)
      return node
    )

  removeRedundant: ->
    key = '_tandemAttributes' + Math.floor(Math.random() * 100000000)
    @node[key] = {}

    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE && node.textContent.length == 0
        return true
      if node.tagName == 'SPAN'
        # Check if children need us
        if node.childNodes.length == 0 || !_.any(node.childNodes, (child) -> child.nodeType != child.ELEMENT_NODE)
          return true
        # Check if parent needs us
        else if node.previousSibling == null && node.nextSibling == null && !TandemLine.isLineNode(node.parentNode)
          return true
      attribute = Tandem.Utils.getAttributeForContainer(node)
      if attribute? && node.parentNode[key]? && node.parentNode[key][attribute] == true
        return true
      return false

    Tandem.Utils.traversePreorder(@node, 0, (node) =>
      if isRedudant(node)
        node = Tandem.Utils.unwrap(node)
      if node?
        node[key] = _.clone(node.parentNode[key])
        attribute = Tandem.Utils.getAttributeForContainer(node)
        node[key][attribute] = true if attribute?
      return node
    )
    delete @node[key]
    Tandem.Utils.traversePreorder(@node, 0, (node) ->
      delete node[key]
      return node
    )

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
