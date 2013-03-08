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
      if node.nodeType == node.ELEMENT_NODE and !ScribeLine.isLineNode(node) and Scribe.Utils.canModify(node)
        next = node.nextSibling
        if next?.tagName == node.tagName and node.tagName != 'LI'and Scribe.Utils.canModify(node) and Scribe.Utils.canModify(next)
          [nodeFormat, nodeValue] = Scribe.Utils.getFormatForContainer(node)
          [nextFormat, nextValue] = Scribe.Utils.getFormatForContainer(next)
          if nodeFormat == nextFormat && nodeValue == nextValue
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
    scribeKey = _.uniqueId('_scribeFormats')
    root[scribeKey] = {}
    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE && Scribe.Utils.canModify(node)
        if Scribe.Utils.getNodeLength(node) == 0
          return true
        [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
        if formatName?
          return node.parentNode[scribeKey][formatName]?     # Parent format value will overwrite child's so no need to check formatValue
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
        node[scribeKey] = _.clone(node.parentNode[scribeKey])
        [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
        node[scribeKey][formatName] = formatValue if formatName?
      return node
    )
    delete root[scribeKey]
    Scribe.Utils.traversePreorder(root, 0, (node) ->
      delete node[scribeKey]
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
    @trailingNewline = true
    this.rebuild()
    super(@node)

  buildLeaves: (node, formats) ->
    _.each(_.clone(node.childNodes), (node) =>
      node.normalize()
      nodeFormats = _.clone(formats)
      [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
      nodeFormats[formatName] = formatValue if formatName?
      if Scribe.Leaf.isLeafNode(node)
        @leaves.append(new Scribe.Leaf(this, node, nodeFormats))
      if Scribe.Leaf.isLeafParent(node)
        this.buildLeaves(node, nodeFormats)
    )

  applyToContents: (offset, length, fn) ->
    return if length <= 0
    [prevNode, startNode] = this.splitContents(offset)
    [endNode, nextNode] = this.splitContents(offset + length)
    Scribe.Utils.traverseSiblings(startNode, endNode, fn)

  deleteText: (offset, length) ->
    this.applyToContents(offset, length, (node) ->
      Scribe.Utils.removeNode(node)
    )
    @trailingNewline = false if @length == offset + length
    this.rebuild()

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

  format: (name, value) ->
    console.warn "Unimplemented"

  formatText: (offset, length, name, value) ->
    return if length <= 0
    [prevNode, startNode] = this.splitContents(offset)
    [endNode, nextNode] = this.splitContents(offset + length)
    parentNode = startNode?.parentNode || prevNode?.parentNode
    if value && Scribe.Utils.getFormatDefault(name) != value
      refNode = null
      formatNode = Scribe.Utils.createContainerForFormat(@doc.root.ownerDocument, name, value)
      this.applyToContents(offset, length, (node) =>
        refNode = node.nextSibling
        node = Scribe.Utils.removeFormatFromSubtree(node, name)
        formatNode.appendChild(node)
      )
      @node.insertBefore(formatNode, refNode)
    else
      this.applyToContents(offset, length, (node) ->
        Scribe.Utils.removeFormatFromSubtree(node, name)
      )
    this.rebuild()

  insertText: (offset, text, formatting = {}) ->
    [leaf, leafOffset] = this.findLeafAtOffset(offset)
    if _.isEqual(leaf.formatting, formatting)
      leaf.insertText(leafOffset, text)
      @length += text.length
      @outerHTML = @node.outerHTML
      @delta = this.toDelta()
    else
      [prevNode, nextNode] = this.splitContents(offset)
      span = @node.ownerDocument.createElement('span')
      span.textContent = text
      parentNode = prevNode?.parentNode or nextNode?.parentNode
      parentNode.insertBefore(span, nextNode)
      _.each(formatting, (value, name) =>
        this.formatText(offset, text.length, name, value)
      )
      this.rebuild()

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
    @length += 1 if @trailingNewline
    @outerHTML = @node.outerHTML
    @formats = {}
    [formatName, formatValue] = Scribe.Utils.getFormatForContainer(@node)
    @formats[formatName] = formatValue if formatName?
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
    ops = _.map(@leaves.toArray(), (leaf) ->
      return new Tandem.InsertOp(leaf.text, leaf.getFormats(true))
    )
    ops.push(new Tandem.InsertOp("\n", @formats)) if @trailingNewline
    delta = new Tandem.Delta(0, @length, ops)
    return delta



window.Scribe ||= {}
window.Scribe.Line = ScribeLine
