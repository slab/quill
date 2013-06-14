Scribe = require('./scribe')
Tandem = require('tandem-core')


class Scribe.Document
  @INDENT_PREFIX: 'indent-'

  constructor: (@root, @renderer) ->
    @normalizer = new Scribe.Normalizer(@renderer)
    this.rebuild()

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  cleanNode: (lineNode) ->
    line = this.findLine(lineNode)
    if line? && this.updateLine(line)
      lineNode.classList.remove(Scribe.Line.DIRTY_CLASS)
      return true
    return false

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
      if offset < line.length
        return false
      else
        offset -= line.length if index < @lines.length - 1
        return true
    )
    return [retLine, offset]

  findLineNode: (node) ->
    while node? && !Scribe.Line.isLineNode(node)
      node = node.parentNode
    return node

  insertLineBefore: (newLineNode, refLine) ->
    line = new Scribe.Line(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  mergeLines: (line, lineToMerge) ->
    return unless line? and lineToMerge?
    _.each(_.clone(lineToMerge.node.childNodes), (child) ->
      line.node.appendChild(child)
    )
    Scribe.Utils.removeNode(lineToMerge.node)
    this.removeLine(lineToMerge)
    line.trailingNewline = lineToMerge.trailingNewline
    line.rebuild()

  rebuild: ->
    @lines = new LinkedList()
    @lineMap = {}
    @normalizer.normalizeDoc(@root, @renderer)
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

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Scribe.DOM.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    return this.insertLineBefore(lineNode2, line.next)

  toDelta: ->
    lines = @lines.toArray()
    ops = _.flatten(_.map(lines, (line, index) ->
      ops = Tandem.Delta.copy(line.delta).ops
      return ops
    ), true)
    delta = new Tandem.Delta(0, ops)
    return delta

  updateLine: (line) ->
    return line.rebuild()


module.exports = Scribe
