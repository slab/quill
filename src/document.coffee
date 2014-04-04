_             = require('lodash')
LinkedList    = require('linked-list')
DOM           = require('./dom')
FormatManager = require('./format-manager')
Line          = require('./line')
Normalizer    = require('./normalizer')
Utils         = require('./utils')
Tandem        = require('tandem-core')


class Document
  constructor: (@root, options = {}) ->
    @formatManager = new FormatManager(@root, options)
    @normalizer = new Normalizer(@root, @formatManager)
    @root.innerHTML = Normalizer.normalizeHtml(@root.innerHTML)
    @lines = new LinkedList()
    @lineMap = {}
    @normalizer.normalizeDoc()
    _.each(DOM.getChildNodes(@root), _.bind(this.appendLine, this))

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  findLeaf: (node) ->
    lineNode = node.parentNode
    while lineNode? && !Utils.isLineNode(lineNode)
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
    curLine = @lines.first
    while curLine?
      return [curLine, offset] if offset <= curLine.length
      offset -= curLine.length + 1
      curLine = curLine.next
    # TODO we want to signal at the very end of document...
    return [null, offset]

  findLineNode: (node) ->
    while node? && !Utils.isLineNode(node)
      node = node.parentNode
    return node

  insertLineBefore: (newLineNode, refLine) ->
    line = new Line(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  mergeLines: (line, lineToMerge) ->
    return unless line? and lineToMerge?
    _.each(DOM.getChildNodes(lineToMerge.node), (child) ->
      line.node.appendChild(child)
    )
    DOM.removeNode(lineToMerge.node)
    this.removeLine(lineToMerge)
    line.rebuild()

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    newLine = this.insertLineBefore(lineNode2, line.next)
    newLine.resetContent()
    return newLine

  toDelta: ->
    lines = @lines.toArray()
    allNewlines = true
    ops = _.flatten(_.map(lines, (line) ->
      ops = _.clone(line.delta.ops)
      ops.push(new Tandem.InsertOp("\n", line.formats)) if line.next?
      allNewlines = allNewlines and line.isNewline()
      return ops
    ), true)
    ops.push(new Tandem.InsertOp("\n", @lines.last.formats)) if @lines.last? and allNewlines
    delta = new Tandem.Delta(0, ops)
    return delta

  updateLine: (line) ->
    return line.rebuild()


module.exports = Document
