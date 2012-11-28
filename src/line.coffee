class ScribeLine extends LinkedList.Node
  @CLASS_NAME : 'line'
  @DIRTY_CLASS: 'dirty'
  @ID_PREFIX  : 'line-'

  @applyRules: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE
        rules = Scribe.Constants.LINE_RULES[node.tagName]
        if rules?
          _.each(rules, (data, rule) ->
            switch rule
              when 'rename' then node = Scribe.Utils.switchTag(node, data)
              else return
          )
        else
          node = Scribe.Utils.unwrap(node)
      return node
    )

  @isLineNode: (node) ->
    return node? && node.classList? && node.classList.contains(ScribeLine.CLASS_NAME)

  @mergeAdjacent: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node) ->
      if node.nodeType == node.ELEMENT_NODE && !ScribeLine.isLineNode(node) && Scribe.Utils.canModify(node)
        next = node.nextSibling
        if next?.tagName == node.tagName && node.tagName != 'LI' && Scribe.Utils.canModify(next)
          [nodeAttr, nodeValue] = Scribe.Utils.getAttributeForContainer(node)
          [nextAttr, nextValue] = Scribe.Utils.getAttributeForContainer(next)
          if nodeAttr == nextAttr && nodeValue == nextValue
            node = Scribe.Utils.mergeNodes(node, next)
      return node
    )

  @normalizeHtml: (root) ->
    return if root.childNodes.length == 1 && root.firstChild.tagName == 'BR'
    this.applyRules(root)
    this.removeNoBreak(root)
    this.removeRedundant(root)
    # TODO need wrapText before and after for these cases:
    # Before: <b>Test<span>What</span></b> -> <b><span>Test</span><span>What</span></b>
    # After: <b>Bold</b><b><i>Test</i></b> -> <b>Bold<i>Test</i></b>
    this.mergeAdjacent(root)
    this.wrapText(root)
    if 0 == _.reduce(root.childNodes, ((count, node) -> return count + (if node.classList.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL) then 0 else 1)), 0)
      if root.tagName == 'OL' || root.tagName == 'UL'
        root.appendChild(root.ownerDocument.createElement('li'))
        root = root.firstChild
      root.appendChild(root.ownerDocument.createElement('br'))

  @removeNoBreak: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node) =>
      if node.nodeType == node.TEXT_NODE
        node.textContent = node.textContent.split(Scribe.Constants.NOBREAK_SPACE).join('')
      return node
    )

  @removeRedundant: (root) ->
    ScribeKey = '_ScribeAttributes' + Math.floor(Math.random() * 100000000)
    root[ScribeKey] = {}
    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE && Scribe.Utils.canModify(node)
        if Scribe.Utils.getNodeLength(node) == 0
          return true
        [attrName, attrValue] = Scribe.Utils.getAttributeForContainer(node)
        if attrName?
          return node.parentNode[ScribeKey][attrName]?     # Parent attribute value will overwrite child's so no need to check attrValue
        else if node.tagName == 'SPAN'
          # Check if children need us
          if node.childNodes.length == 0 || !_.any(node.childNodes, (child) -> child.nodeType != child.ELEMENT_NODE)
            return true
          # Check if parent needs us
          if node.previousSibling == null && node.nextSibling == null && !ScribeLine.isLineNode(node.parentNode) && node.parentNode.tagName != 'LI'
            return true
      return false
    Scribe.Utils.traversePreorder(root, 0, (node) =>
      if isRedudant(node)
        node = Scribe.Utils.unwrap(node)
      if node?
        node[ScribeKey] = _.clone(node.parentNode[ScribeKey])
        [attrName, attrValue] = Scribe.Utils.getAttributeForContainer(node)
        node[ScribeKey][attrName] = attrValue if attrName?
      return node
    )
    delete root[ScribeKey]
    Scribe.Utils.traversePreorder(root, 0, (node) ->
      delete node[ScribeKey]
      return node
    )
    
  @wrapText: (root) ->
    Scribe.Utils.traversePreorder(root, 0, (node) =>
      node.normalize()
      if node.nodeType == node.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == root || node.parentNode.tagName == 'LI')
        span = node.ownerDocument.createElement('span')
        Scribe.Utils.wrap(span, node)
        node = span
      return node
    )



  constructor: (@doc, @node) ->
    @id = _.uniqueId(Scribe.Line.ID_PREFIX)
    @node.id = @id
    @node.classList.add(ScribeLine.CLASS_NAME)
    this.rebuild()
    super(@node)

  buildLeaves: (node, attributes) ->
    _.each(_.clone(node.childNodes), (node) =>
      node.normalize()
      nodeAttributes = _.clone(attributes)
      [attrName, attrVal] = Scribe.Utils.getAttributeForContainer(node)
      nodeAttributes[attrName] = attrVal if attrName?
      if Scribe.Leaf.isLeafNode(node)
        @leaves.append(new Scribe.Leaf(this, node, nodeAttributes))
      if Scribe.Leaf.isLeafParent(node)
        this.buildLeaves(node, nodeAttributes)
    )

  applyToContents: (offset, length, fn) ->
    return if length <= 0
    [prevNode, startNode] = this.splitContents(offset)
    [endNode, nextNode] = this.splitContents(offset + length)
    Scribe.Utils.traverseSiblings(startNode, endNode, fn)

  applyAttribute: (offset, length, attr, value) ->
    return if length <= 0
    [prevNode, startNode] = this.splitContents(offset)
    [endNode, nextNode] = this.splitContents(offset + length)
    parentNode = startNode?.parentNode || prevNode?.parentNode
    if value && Scribe.Utils.getAttributeDefault(attr) != value
      refNode = null
      attrNode = Scribe.Utils.createContainerForAttribute(@doc.root.ownerDocument, attr, value)
      this.applyToContents(offset, length, (node) =>
        refNode = node.nextSibling
        node = Scribe.Utils.removeAttributeFromSubtree(node, attr)
        attrNode.appendChild(node)
      )
      @node.insertBefore(attrNode, refNode)
    else
      this.applyToContents(offset, length, (node) ->
        Scribe.Utils.removeAttributeFromSubtree(node, attr)
      )

  deleteText: (offset, length) ->
    this.applyToContents(offset, length, (node) ->
      Scribe.Utils.removeNode(node)
    )

  findLeaf: (leafNode) ->
    curLeaf = @leaves.first
    while curLeaf?
      return curLeaf if curLeaf.node == leafNode
      curLeaf = curLeaf.next
    return null

  findLeafAtOffset: (offset) ->
    retLeaf = @leaves.first
    _.all(@leaves.toArray(), (leaf) ->
      retLeaf = leaf
      if offset > leaf.length && leaf.next?
        offset -= leaf.length
        return true
      else
        return false
    )
    return [retLeaf, offset]

  rebuild: ->
    if @node.parentNode == @doc.root
      return false if @outerHTML? && @outerHTML == @node.outerHTML && !@node.classList.contains(ScribeLine.DIRTY_CLASS)
      while @leaves? && @leaves.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      ScribeLine.normalizeHtml(@node)
      this.buildLeaves(@node, {})
      this.resetContent()
    else
      @doc.removeLine(this)
    return true

  resetContent: ->
    @length = _.reduce(@leaves.toArray(), ((length, leaf) -> leaf.length + length), 0)
    @outerHTML = @node.outerHTML
    @attributes = {}
    [attrName, attrVal] = Scribe.Utils.getAttributeForContainer(@node)
    @attributes[attrName] = attrVal if attrName?
    this.setDirty(false)
    @delta = this.toDelta()

  setDirty: (isDirty = true) ->
    if isDirty
      @node.classList.add(ScribeLine.DIRTY_CLASS)
    else
      @node.classList.remove(ScribeLine.DIRTY_CLASS)

  splitContents: (offset) ->
    this.setDirty()
    [node, offset] = Scribe.Utils.getChildAtOffset(@node, offset)
    if @node.tagName == 'OL' || @node.tagName == 'UL'
      [node, offset] = Scribe.Utils.getChildAtOffset(node, offset)
    return Scribe.Utils.splitNode(node, offset)

  toDelta: ->
    deltas = _.map(@leaves.toArray(), (leaf) ->
      return new JetInsert(leaf.text, leaf.getAttributes(true))
    )
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta



window.Scribe ||= {}
window.Scribe.Line = ScribeLine
