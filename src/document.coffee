#= require underscore
#= require linked_list
#= require tandem/line


class TandemDocument
  @INDENT_PREFIX: 'indent-'


  @normalizeHtml: (root, options = {}) ->
    if root.childNodes.length == 0
      div = root.ownerDocument.createElement('div')
      return root.appendChild(div)
    _.each(_.clone(root.childNodes), (child) =>
      if child.nodeType != child.ELEMENT_NODE
        child.parentNode.removeChild(child)
      else if options.ignoreDirty || child.classList.contains(Tandem.Line.DIRTY_CLASS) || true
        # TODO editor.update should mark dirty lines
        Tandem.Line.normalizeHtml(child)
    )


  constructor: (@editor, @root) ->
    this.buildLines()

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  applyAttribute: (index, length, attr, value) ->
    [startLine, startLineOffset] = this.findLineAtOffset(index)
    [endLine, endLineOffset] = this.findLineAtOffset(index + length)
    if startLine == endLine
      startLine.applyAttribute(startLineOffset, endLineOffset, attr, value)
    else
      curLine = startLine.next
      while curLine? && curLine != endLine
        next = curLine.next
        curLine.applyAttribute(0, curLine.length, attr, value)
        curLine = next
      startLine.applyAttribute(startLineOffset, startLine.length, attr, value)
      endLine.applyAttribute(0, endLineOffset, attr, value) if endLine?

  buildLines: ->
    this.reset()
    TandemDocument.normalizeHtml(@root, {ignoreDirty: true})
    this.rebuild()

  cleanNode: (lineNode) ->
    line = this.findLine(lineNode)
    if line? && this.updateLine(line)
      lineNode.classList.remove(Tandem.Line.DIRTY_CLASS)
      return true
    return false

  deleteText: (index, length) ->
    if index + length == @length
      @trailingNewline = false
      @length -= 1
      length -= 1
    return if length <= 0
    [startLineNode, startOffset] = Tandem.Utils.getChildAtOffset(@root, index)
    [endLineNode, endOffset] = Tandem.Utils.getChildAtOffset(@root, index + length)
    fragment = Tandem.Utils.extractNodes(startLineNode, startOffset, endLineNode, endOffset)
    lineNodes = _.values(fragment.childNodes).concat(_.uniq([startLineNode, endLineNode]))
    _.each(lineNodes, (lineNode) =>
      line = this.findLine(lineNode)
      this.updateLine(line) if line?
    )

  detectChange: ->
    # Go through HTML (which should be normalized)
    # Make sure non are different from their innerHTML, if so record change
    # Returns changes made

  findLeaf: (node) ->
    lineNode = node.parentNode
    while lineNode? && !Tandem.Line.isLineNode(lineNode)
      lineNode = lineNode.parentNode
    return null if !lineNode?
    line = this.findLine(lineNode)
    return line.findLeaf(node)

  findLine: (node) ->
    node = this.findLineNode(node)
    return @lineMap[node.id]

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
    while node? && !Tandem.Line.isLineNode(node)
      node = node.parentNode
    return node

  forceTrailingNewline: ->
    unless @trailingNewline
      if @lines.length > 1 && @lines.last.length == 0
        @root.removeChild(@lines.last.node)
        this.removeLine(@lines.last)
      @trailingNewline = true
      @length += 1

  insertLineBefore: (newLineNode, refLine) ->
    line = new Tandem.Line(this, newLineNode)
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
    lineNode.classList.add(Tandem.Line.CLASS_NAME)
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
    tab.classList.add(Tandem.Leaf.TAB_NODE_CLASS)
    tab.classList.add(Tandem.Constants.SPECIAL_CLASSES.ATOMIC)
    tab.textContent = "\t"
    return tab

  makeText: (text) ->
    node = @root.ownerDocument.createElement('span')
    node.textContent = text
    return node

  # insertContentsAt: (Number startIndex, String text) ->
  # insertContentsAt: (TandemRange startIndex, String text) ->
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
      parentNode.removeChild(leaf.node)
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
    @root.firstChild.classList.add(Tandem.Line.DIRTY_CLASS)
    @root.lastChild.classList.add(Tandem.Line.DIRTY_CLASS)
    dirtyNodes = _.clone(@root.getElementsByClassName(Tandem.Line.DIRTY_CLASS))
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
    [lineNode1, lineNode2] = Tandem.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    return this.insertLineBefore(lineNode2, line.next)

  toDelta: ->
    lines = @lines.toArray()
    deltas = _.flatten(_.map(lines, (line, index) ->
      deltas = JetDelta.copy(line.delta).deltas
      deltas.push(new JetInsert("\n", line.attributes)) if index < lines.length - 1
      return deltas
    ), true)
    attributes = if @lines.last? then @lines.last.attributes else {}
    deltas.push(new JetInsert("\n", attributes)) if @trailingNewline
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta

  updateDirty: ->
    dirtyNodes = @root.ownerDocument.getElementsByClassName(Tandem.Line.DIRTY_CLASS)
    fixLines = false
    _.each(dirtyNodes, (dirtyNode) =>
      line = this.findLine(dirtyNode)
      if line?
        this.updateLine(line)
        fixLines = true if line.attributes['list']?
    )

  updateLine: (line) ->
    @length -= line.length
    didRebuild = line.rebuild()
    @length += line.length
    return didRebuild



window.Tandem ||= {}
window.Tandem.Document = TandemDocument
