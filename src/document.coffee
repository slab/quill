#= require underscore
#= require linked_list
#= require tandem/line


class TandemDocument
  @INDENT_PREFIX: 'indent-'


  @fixListNumbering: (root) ->
    ols = root.querySelectorAll('ol')
    _.each(ols, (ol) ->
      indent = Tandem.Utils.getIndent(ol)
      previous = ol.previousSibling
      while true
        if !previous? || previous.tagName != 'OL'
          return ol.setAttribute('start', 1)
        else
          prevIndent = Tandem.Utils.getIndent(previous)
          if prevIndent < indent
            return ol.setAttribute('start', 1)
          else if prevIndent == indent
            return ol.setAttribute('start', parseInt(previous.getAttribute('start')) + 1)
          else
            previous = previous.previousSibling
    )

  @normalizeHtml: (root, options = {}) ->
    if root.childNodes.length == 0
      div = root.ownerDocument.createElement('div')
      return root.appendChild(div)
    _.each(_.clone(root.childNodes), (child) =>
      if child.nodeType != child.ELEMENT_NODE
        child.parentNode.removeChild(child)
      else
        # TODO editor.update should mark dirty lines
        if options.ignoreDirty || child.classList.contains(Tandem.Line.DIRTY_CLASS) || true
          #lineNodes = Tandem.Utils.breakBlocks(child)
          #_.each(lineNodes, (lineNode) ->
          #  Tandem.Line.normalizeHtml(lineNode)
          #)
          Tandem.Line.normalizeHtml(child)
    )
    TandemDocument.fixListNumbering(root)


  constructor: (@editor, @root) ->
    this.buildLines()

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

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
    console.log offset, @root.innerHTML
    retLine = @lines.first
    _.all(@lines.toArray(), (line, index) =>
      retLine = line
      if offset < line.length
        return false
      else
        offset -= line.length if index < @lines.length - 1
        return true
    )
    console.log retLine, offset
    return [retLine, offset]

  findLineNode: (node) ->
    while node? && !Tandem.Line.isLineNode(node)
      node = node.parentNode
    return node

  insertLineBefore: (newLineNode, refLine) ->
    line = new Tandem.Line(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    @length += line.length
    return line

  printLines: ->
    lines = @lines.toArray() 
    console.info lines.length
    _.each(lines, (line) ->
      console.info line, line.id, line.node.textContent
    )

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

  reset: ->
    @lines = new LinkedList()
    @lineMap = {}
    @length = 0

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Tandem.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    return this.insertLineBefore(lineNode2, line.next)

  toDelta: ->
    lines = @lines.toArray()
    deltas = _.flatten(_.map(lines, (line, index) ->
      return JetDelta.copy(line.delta).deltas
    ), true)
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
    TandemDocument.fixListNumbering(@root) if fixLines

  updateLine: (line) ->
    @length -= line.length
    didRebuild = line.rebuild()
    @length += line.length
    return didRebuild



window.Tandem ||= {}
window.Tandem.Document = TandemDocument
