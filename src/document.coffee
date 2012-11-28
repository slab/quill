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
    if index + length == @length
      @trailingNewline = false
      @length -= 1
      length -= 1
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

  forceTrailingNewline: ->
    unless @trailingNewline
      if @lines.length > 1 && @lines.last.length == 0
        Scribe.Utils.removeNode(@lines.last.node)
        this.removeLine(@lines.last)
      @trailingNewline = true
      @length += 1

  format: (index, length, name, value) ->
    this.applyToLines(index, length, (line, offset, length) =>
      line.format(offset, length, name, value)
      this.updateLine(line)
    )

  insertLineBefore: (newLineNode, refLine) ->
    line = new Scribe.Line(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    @length += line.length
    @length += 1 if @lines.length > 1
    return line

  insertText: (index, text) ->
    [line, lineOffset] = this.findLineAtOffset(index)
    textLines = text.split("\n")
    if index == @length && @trailingNewline
      @trailingNewline = false
      @length -= 1    # Doc did not get shorter but _.each loop compensates
      _.each(textLines, (textLine) =>
        contents = this.makeLineContents(textLine)
        div = @root.ownerDocument.createElement('div')
        _.each(contents, (content) ->
          div.appendChild(content)
        )
        @root.appendChild(div)
        this.appendLine(div)
      )
    else if textLines.length == 1
      contents = this.makeLineContents(text)
      this.insertContentsAt(line, lineOffset, contents)
    else
      [line1, line2] = this.insertNewlineAt(line, lineOffset)
      contents = this.makeLineContents(textLines[0])
      this.insertContentsAt(line1, lineOffset, contents)
      contents = this.makeLineContents(textLines[textLines.length - 1])
      this.insertContentsAt(line2, 0, contents) 
      if textLines.length > 2
        _.each(textLines.slice(1, -1), (lineText) =>
          lineNode = this.makeLine(lineText)
          @root.insertBefore(lineNode, line2.node)
          this.insertLineBefore(lineNode, line2)
        ) 

  makeLine: (text) ->
    lineNode = @root.ownerDocument.createElement('div')
    lineNode.classList.add(Scribe.Line.CLASS_NAME)
    contents = this.makeLineContents(text)
    _.each(contents, (content) ->
      lineNode.appendChild(content)
    )
    return lineNode

  makeLineContents: (text) ->
    strings = text.split("\t")
    contents = []
    _.each(strings, (str, strIndex) =>
      contents.push(this.makeText(str)) if str.length > 0
      if strIndex < strings.length - 1
        contents.push(this.makeTab())
    )
    return contents

  makeTab: ->
    tab = @root.ownerDocument.createElement('span')
    tab.classList.add(Scribe.Leaf.TAB_NODE_CLASS)
    tab.classList.add(Scribe.Constants.SPECIAL_CLASSES.ATOMIC)
    tab.textContent = "\t"
    return tab

  makeText: (text) ->
    node = @root.ownerDocument.createElement('span')
    node.textContent = text
    return node

  # insertContentsAt: (Number startIndex, String text) ->
  # insertContentsAt: (ScribeRange startIndex, String text) ->
  insertContentsAt: (line, offset, contents) ->
    return if contents.length == 0
    [leaf, leafOffset] = line.findLeafAtOffset(offset)
    if leaf.node.nodeName != 'BR'
      [beforeNode, afterNode] = line.splitContents(offset)
      parentNode = beforeNode?.parentNode || afterNode?.parentNode
      _.each(contents, (content) ->
        parentNode.insertBefore(content, afterNode)
      )
    else
      parentNode = leaf.node.parentNode
      Scribe.Utils.removeNode(leaf.node)
      _.each(contents, (content) ->
        parentNode.appendChild(content)
      )
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
    @root.firstChild.classList.add(Scribe.Line.DIRTY_CLASS)
    @root.lastChild.classList.add(Scribe.Line.DIRTY_CLASS)
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
    @length -= line.length
    @length -= 1 if @lines.length >= 1

  reset: ->
    @lines = new LinkedList()
    @lineMap = {}
    @length = 1
    @trailingNewline = true

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Scribe.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    return this.insertLineBefore(lineNode2, line.next)

  toDelta: ->
    lines = @lines.toArray()
    deltas = _.flatten(_.map(lines, (line, index) ->
      deltas = JetDelta.copy(line.delta).deltas
      deltas.push(new JetInsert("\n", line.formats)) if index < lines.length - 1
      return deltas
    ), true)
    formats = if @lines.last? then @lines.last.formats else {}
    deltas.push(new JetInsert("\n", formats)) if @trailingNewline
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
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
    @length -= line.length
    didRebuild = line.rebuild()
    @length += line.length
    return didRebuild



window.Scribe ||= {}
window.Scribe.Document = ScribeDocument
