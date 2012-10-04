#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/constants

class TandemLine extends LinkedList.Node
  @CLASS_NAME : 'line'
  @DIRTY_CLASS: 'dirty'
  @ID_PREFIX  : 'line-'

  @applyRules: (root) ->
    Tandem.Utils.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE
        rules = Tandem.Constants.LINE_RULES[node.tagName]
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
        if next?.tagName == node.tagName && node.tagName != 'LI' && !Tandem.Utils.isIgnoreNode(node) && !Tandem.Utils.isIgnoreNode(next)
          [nodeAttr, nodeValue] = Tandem.Utils.getAttributeForContainer(node)
          [nextAttr, nextValue] = Tandem.Utils.getAttributeForContainer(next)
          if nodeAttr == nextAttr && nodeValue == nextValue
            node = Tandem.Utils.mergeNodes(node, next)
      return node
    )

  @normalizeHtml: (root) ->
    return if root.childNodes.length == 1 && root.firstChild.tagName == 'BR'
    this.applyRules(root)
    this.removeRedundant(root)
    this.wrapText(root)
    this.mergeAdjacent(root)
    root.appendChild(root.ownerDocument.createElement('br')) if root.firstChild == null

  @removeRedundant: (root) ->
    tandemKey = '_tandemAttributes' + Math.floor(Math.random() * 100000000)
    root[tandemKey] = {}

    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE && !Tandem.Utils.isIgnoreNode(node)
        if node.textContent.length == 0
          return true
        [attrName, attrValue] = Tandem.Utils.getAttributeForContainer(node)
        if attrName?
          return node.parentNode[tandemKey][attrName]?     # Parent attribute value will overwrite child's so no need to check attrValue
        else if node.tagName == 'SPAN'
          # Check if children need us
          if node.childNodes.length == 0 || !_.any(node.childNodes, (child) -> child.nodeType != child.ELEMENT_NODE)
            return true
          # Check if parent needs us
          if node.previousSibling == null && node.nextSibling == null && !TandemLine.isLineNode(node.parentNode) && node.parentNode.tagName != 'LI'
            return true
      return false

    Tandem.Utils.traversePreorder(root, 0, (node) =>
      if isRedudant(node)
        node = Tandem.Utils.unwrap(node)
      if node?
        node[tandemKey] = _.clone(node.parentNode[tandemKey])
        [attrName, attrValue] = Tandem.Utils.getAttributeForContainer(node)
        node[tandemKey][attrName] = attrValue if attrName?
      return node
    )
    delete root[tandemKey]
    Tandem.Utils.traversePreorder(root, 0, (node) ->
      delete node[tandemKey]
      return node
    )
    
  @wrapText: (root) ->
    Tandem.Utils.traversePreorder(root, 0, (node) =>
      node.normalize()
      if node.nodeType == node.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == root || node.parentNode.tagName == 'LI')
        span = node.ownerDocument.createElement('span')
        Tandem.Utils.wrap(span, node)
        node = span
      return node
    )



  constructor: (@doc, @node) ->
    @id = _.uniqueId(Tandem.Line.ID_PREFIX)
    @node.id = @id
    @node.classList.add(TandemLine.CLASS_NAME)
    this.rebuild()
    super(@node)

  buildLeaves: (node, attributes) ->
    _.each(_.clone(node.childNodes), (node) =>
      node.normalize()
      nodeAttributes = _.clone(attributes)
      [attrName, attrVal] = Tandem.Utils.getAttributeForContainer(node)
      nodeAttributes[attrName] = attrVal if attrName?
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

  rebuild: ->
    if @node.parentNode == @doc.root
      return if @outerHTML == @node.outerHTML
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
    @outerHTML = @node.outerHTML
    @attributes = {}
    [attrName, attrVal] = Tandem.Utils.getAttributeForContainer(@node)
    @attributes[attrName] = attrVal if attrName?
    @delta = this.toDelta()
    this.setDirty(false)

  setDirty: (isDirty = true) ->
    if isDirty
      @node.classList.add(TandemLine.DIRTY_CLASS)
    else
      @node.classList.remove(TandemLine.DIRTY_CLASS)

  splitContents: (offset) ->
    this.setDirty()
    [node, offset] = Tandem.Utils.getChildAtOffset(@node, offset)
    return Tandem.Utils.splitNode(node, offset)

  toDelta: ->
    deltas = _.map(@leaves.toArray(), (leaf) ->
      return new JetInsert(leaf.text, leaf.getAttributes())
    )
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta



window.Tandem ||= {}
window.Tandem.Line = TandemLine
