#= require underscore
#= require linked_list
#= require tandem/constants
#= require tandem/leaf
#= require tandem/utils

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
      if node.nodeType == node.ELEMENT_NODE && !TandemLine.isLineNode(node) && Tandem.Utils.canModify(node)
        next = node.nextSibling
        if next?.tagName == node.tagName && node.tagName != 'LI' && Tandem.Utils.canModify(next)
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
    # TODO need wrapText before and after for these cases:
    # Before: <b>Test<span>What</span></b> -> <b><span>Test</span><span>What</span></b>
    # After: <b>Bold</b><b><i>Test</i></b> -> <b>Bold<i>Test</i></b>
    this.wrapText(root)
    this.mergeAdjacent(root)
    this.wrapText(root)
    if root.childNodes.length <= root.querySelectorAll(".#{Tandem.Constants.SPECIAL_CLASSES.EXTERNAL}").length
      if root.tagName == 'OL' || root.tagName == 'UL'
        root.appendChild(root.ownerDocument.createElement('li'))
        root = root.firstChild
      root.appendChild(root.ownerDocument.createElement('br'))

  @removeRedundant: (root) ->
    tandemKey = '_tandemAttributes' + Math.floor(Math.random() * 100000000)
    root[tandemKey] = {}

    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE && Tandem.Utils.canModify(node)
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
      return false if @outerHTML? && @outerHTML == @node.outerHTML && !@node.classList.contains(TandemLine.DIRTY_CLASS)
      while @leaves? && @leaves.length > 0
        @leaves.remove(@leaves.first)
      @leaves = new LinkedList()
      TandemLine.normalizeHtml(@node)
      this.buildLeaves(@node, {})
      this.resetContent()
    else
      @doc.removeLine(this)
    return true

  resetContent: ->
    @length = _.reduce(@leaves.toArray(), ((length, leaf) -> leaf.length + length), 0)
    @outerHTML = @node.outerHTML
    @attributes = {}
    [attrName, attrVal] = Tandem.Utils.getAttributeForContainer(@node)
    @attributes[attrName] = attrVal if attrName?
    this.setDirty(false)
    @delta = this.toDelta()

  setDirty: (isDirty = true) ->
    if isDirty
      @node.classList.add(TandemLine.DIRTY_CLASS)
    else
      @node.classList.remove(TandemLine.DIRTY_CLASS)

  splitContents: (offset) ->
    this.setDirty()
    [node, offset] = Tandem.Utils.getChildAtOffset(@node, offset)
    if @node.tagName == 'OL' || @node.tagName == 'UL'
      [node, offset] = Tandem.Utils.getChildAtOffset(node, offset)
    return Tandem.Utils.splitNode(node, offset)

  toDelta: ->
    deltas = _.map(@leaves.toArray(), (leaf) ->
      return new JetInsert(leaf.text, leaf.getAttributes(true))
    )
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta



window.Tandem ||= {}
window.Tandem.Line = TandemLine
