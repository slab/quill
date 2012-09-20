#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/tags

class TandemLine extends LinkedList.Node
  @CLASS_NAME : 'line'
  @DIRTY_CLASS: 'dirty'
  @ID_PREFIX  : 'line-'
  @counter    : 0

  @applyRules: (root) ->
    Tandem.Utils.traversePreorder(root, 0, (node, index) =>
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

  @isLineNode: (node) ->
    return node? && node.classList? && node.classList.contains(TandemLine.CLASS_NAME)

  @mergeAdjacent: (root) ->
    Tandem.Utils.traversePreorder(root, 0, (node) ->
      if node.nodeType == node.ELEMENT_NODE && !TandemLine.isLineNode(node)
        next = node.nextSibling
        if next? && node.tagName == next.tagName && node.className == next.className
          node = Tandem.Utils.mergeNodes(node, next)
      return node
    )

  @normalizeHtml: (root) ->
    return if root.childNodes.length == 1 && root.firstChild.tagName == 'BR'
    this.applyRules(root)
    this.removeRedundant(root)
    this.mergeAdjacent(root)
    this.wrapText(root)
    root.appendChild(root.ownerDocument.createElement('br')) if root.firstChild == null

  @removeRedundant: (root) ->
    key = '_tandemAttributes' + Math.floor(Math.random() * 100000000)
    root[key] = {}

    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE
        if node.textContent.length == 0
          return true
        attribute = Tandem.Utils.getAttributeForContainer(node)
        if attribute? && node.parentNode[key]? && node.parentNode[key][attribute] == true
          return true
        if node.tagName == 'SPAN'
          # Check if children need us
          if node.childNodes.length == 0 || !_.any(node.childNodes, (child) -> child.nodeType != child.ELEMENT_NODE)
            return true
          # Check if parent needs us
          else if node.previousSibling == null && node.nextSibling == null && !TandemLine.isLineNode(node.parentNode)
            return true
      return false

    Tandem.Utils.traversePreorder(root, 0, (node) =>
      if isRedudant(node)
        node = Tandem.Utils.unwrap(node)
      if node?
        node[key] = _.clone(node.parentNode[key])
        attribute = Tandem.Utils.getAttributeForContainer(node)
        node[key][attribute] = true if attribute?
      return node
    )
    delete root[key]
    Tandem.Utils.traversePreorder(root, 0, (node) ->
      delete node[key]
      return node
    )
    
  @wrapText: (root) ->
    Tandem.Utils.traversePreorder(root, 0, (node) =>
      node.normalize()
      if node.nodeType == node.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == root)
        span = node.ownerDocument.createElement('span')
        Tandem.Utils.wrap(span, node)
        node = span
      return node
    )



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
        @leaves.append(new Tandem.Leaf(this, node, nodeAttributes))
      else
        this.buildLeaves(node, nodeAttributes)
    )

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  splitContents: (offset) ->
    this.setDirty()
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
    if @node.parentNode == @doc.root
      while @leaves? && @leaves.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      TandemLine.normalizeHtml(@node)
      this.buildLeaves(@node, {})
      this.resetContent()
    else
      @doc.removeLine(this)

  resetContent: ->
    @length = @node.textContent.length
    @innerHTML = @node.innerHTML
    @delta = this.toDelta()
    this.setDirty(false)

  setDirty: (isDirty = true) ->
    if isDirty
      @node.classList.add(TandemLine.DIRTY_CLASS)
    else
      @node.classList.remove(TandemLine.DIRTY_CLASS)



window.Tandem ||= {}
window.Tandem.Line = TandemLine
