class ScribeDocument
  @INDENT_PREFIX: 'indent-'


  @normalizeHtml: (root, options = {}) ->
    if root.childNodes.length == 0
      div = root.ownerDocument.createElement('div')
      return root.appendChild(div)
    Scribe.Utils.groupBlocks(root)
    _.each(_.clone(root.childNodes), (child) =>
      if child.nodeType != child.ELEMENT_NODE
        Scribe.Utils.removeNode(child)
      else if options.ignoreDirty || child.classList.contains(Scribe.Line.DIRTY_CLASS) || true
        Scribe.Line.wrapText(child)
        Scribe.Line.normalizeHtml(child)
    )


  constructor: (@root) ->
    this.buildLines()

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  applyToLines: (index, length, fn) ->
    [startLine, startOffset] = this.findLineAtOffset(index)
    [endLine, endOffset] = this.findLineAtOffset(index + length)
    if startLine == endLine
      fn(startLine, startOffset, endOffset - startOffset)
    else
      curLine = startLine.next
      fn(startLine, startOffset, startLine.length + 1 - startOffset)
      while curLine? && curLine != endLine
        next = curLine.next
        fn(curLine, 0, curLine.length + 1)
        curLine = next
      fn(endLine, 0, endOffset)

  buildLines: ->
    this.reset()
    ScribeDocument.normalizeHtml(@root, {ignoreDirty: true})
    this.rebuild()

  cleanNode: (lineNode) ->
    return if lineNode.classList.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
    line = this.findLine(lineNode)
    if line? && this.updateLine(line)
      lineNode.classList.remove(Scribe.Line.DIRTY_CLASS)
      return true
    return false

  deleteText: (index, length) ->
    return if length <= 0
    firstLine = lastLine = null
    this.applyToLines(index, length, (line, offset, length) =>
      firstLine = line unless firstLine?
      lastLine = line
      if offset == 0 && length == line.length + 1
        Scribe.Utils.removeNode(line.node)
      else
        line.deleteText(offset, length)
      this.updateLine(line)
    )
    if firstLine != lastLine and this.findLine(firstLine.node) and this.findLine(lastLine.node)
      Scribe.Utils.mergeNodes(firstLine.node, lastLine.node)
      this.updateLine(firstLine)
      this.removeLine(lastLine)

  findLeaf: (node) ->
    lineNode = node.parentNode
    while lineNode? && !Scribe.Line.isLineNode(lineNode)
      lineNode = lineNode.parentNode
    return null if !lineNode?
    line = this.findLine(lineNode)
    return line.findLeaf(node)

  findLine: (node) ->
    node = this.findLineNode(node)
    if node?
      return @lineMap[node.id]
    else
      return null

  findLineAtOffset: (offset) ->
    retLine = @lines.first
    _.all(@lines.toArray(), (line, index) =>
      retLine = line
      if offset < line.length + 1
        return false
      else
        offset -= (line.length + 1) if index < @lines.length - 1
        return true
    )
    return [retLine, offset]

  findLineNode: (node) ->
    while node? && !Scribe.Line.isLineNode(node)
      node = node.parentNode
    return node

  formatText: (index, length, name, value) ->
    this.applyToLines(index, length, (line, offset, length) =>
      line.formatText(offset, length, name, value)
      this.updateLine(line)
    )

  insertLineBefore: (newLineNode, refLine) ->
    line = new Scribe.Line(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  makeLine: (text) ->
    lineNode = @root.ownerDocument.createElement('div')
    lineNode.classList.add(Scribe.Line.CLASS_NAME)
    textNode = this.makeText(text)
    lineNode.appendChild(textNode)
    return lineNode

  makeText: (text) ->
    node = @root.ownerDocument.createElement('span')
    node.textContent = text
    return node

  mergeLines: (line, lineToMerge) ->
    _.each(_.clone(lineToMerge.node.childNodes), (child) ->
      line.node.appendChild(child)
    )
    Scribe.Utils.removeNode(lineToMerge.node)
    this.removeLine(lineToMerge)
    line.rebuild()

  insertNodeAt: (line, offset, node) ->
    [leaf, leafOffset] = line.findLeafAtOffset(offset)
    if leaf.node.nodeName != 'BR'
      [beforeNode, afterNode] = line.splitContents(offset)
      parentNode = beforeNode?.parentNode || afterNode?.parentNode
      parentNode.insertBefore(node, afterNode)
    else
      parentNode = leaf.node.parentNode
      Scribe.Utils.removeNode(leaf.node)
      parentNode.appendChild(node)
    this.updateLine(line)

  insertNewlineAt: (line, offset) ->
    if offset == 0 or offset == line.length
      div = @root.ownerDocument.createElement('div')
      if offset == 0
        @root.insertBefore(div, line.node)
        newLine = this.insertLineBefore(div, line)
        return [newLine, line]
      else
        refLine = line.next
        refLineNode = if refLine? then refLine.node else null
        @root.insertBefore(div, refLineNode)
        newLine = this.insertLineBefore(div, refLine)
        return [line, newLine]
    else
      newLine = this.splitLine(line, offset)
      return [line, newLine]

  rebuild: ->
    this.reset()
    _.each(@root.childNodes, (node) =>
      this.appendLine(node)
    )

  rebuildDirty: ->
    # First and last nodes are always dirty to handle edge cases
    @root.firstChild.classList.add(Scribe.Line.DIRTY_CLASS) if @root.firstChild?
    @root.lastChild.classList.add(Scribe.Line.DIRTY_CLASS)  if @root.lastChild?
    dirtyNodes = _.clone(@root.getElementsByClassName(Scribe.Line.DIRTY_CLASS))
    _.each((dirtyNodes), (lineNode, index) =>
      this.cleanNode(lineNode)
      prevNode = lineNode.previousSibling
      nextNode = lineNode.nextSibling
      while prevNode? && prevNode != dirtyNodes[index - 1]
        this.cleanNode(prevNode)
        prevNode = prevNode.previousSibling
      while nextNode? && nextNode != dirtyNodes[index + 1]
        this.cleanNode(nextNode)
        nextNode = nextNode.nextSibling
    )

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)

  reset: ->
    @lines = new LinkedList()
    @lineMap = {}

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Scribe.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    return this.insertLineBefore(lineNode2, line.next)

  toDelta: ->
    lines = @lines.toArray()
    ops = _.flatten(_.map(lines, (line, index) ->
      ops = Tandem.Delta.copy(line.delta).ops
      ops.push(new Tandem.InsertOp("\n", line.formats))
      return ops
    ), true)
    delta = new Tandem.Delta(0, ops)
    return delta

  updateDirty: ->
    dirtyNodes = @root.ownerDocument.getElementsByClassName(Scribe.Line.DIRTY_CLASS)
    fixLines = false
    _.each(dirtyNodes, (dirtyNode) =>
      line = this.findLine(dirtyNode)
      if line?
        this.updateLine(line)
        fixLines = true if line.formats['list']?
    )

  updateLine: (line) ->
    return line.rebuild()



window.Scribe ||= {}
window.Scribe.Document = ScribeDocument
