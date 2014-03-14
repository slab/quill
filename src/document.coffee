_                   = require('lodash')
LinkedList          = require('linked-list')
ScribeDOM           = require('./dom')
ScribeFormatManager = require('./format-manager')
ScribeLine          = require('./line')
ScribeNormalizer    = require('./normalizer')
ScribeUtils         = require('./utils')
Tandem              = require('tandem-core')


class ScribeDocument
  constructor: (@root, options = {}) ->
    @formatManager = new ScribeFormatManager(@root, options)
    @normalizer = new ScribeNormalizer(@root, @formatManager)
    @root.innerHTML = ScribeNormalizer.normalizeHtml(@root.innerHTML)
    @lines = new LinkedList()
    @lineMap = {}
    @normalizer.normalizeDoc()
    _.each(ScribeDOM.getChildNodes(@root), this.appendLine.bind(this))

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  findLeaf: (node) ->
    lineNode = node.parentNode
    while lineNode? && !ScribeUtils.isLineNode(lineNode)
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
    while node? && !ScribeUtils.isLineNode(node)
      node = node.parentNode
    return node

  insertLineBefore: (newLineNode, refLine) ->
    line = new ScribeLine(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  mergeLines: (line, lineToMerge) ->
    return unless line? and lineToMerge?
    _.each(ScribeDOM.getChildNodes(lineToMerge.node), (child) ->
      line.node.appendChild(child)
    )
    ScribeDOM.removeNode(lineToMerge.node)
    this.removeLine(lineToMerge)
    line.rebuild()

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = ScribeUtils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    newLine = this.insertLineBefore(lineNode2, line.next)
    newLine.resetContent()
    return newLine

  toDelta: ->
    lines = @lines.toArray()
    appendNewline = lines.length > 0
    ops = _.flatten(_.map(lines, (line) ->
      appendNewline = false if line.length > 0
      ops = _.clone(line.delta.ops)
      ops.push(new Tandem.InsertOp("\n", line.formats)) if line.next?
      return ops
    ), true)
    # TODO this is unintitive without going through the examples...
    ops.push(new Tandem.InsertOp("\n", @lines.last.formats)) if appendNewline
    delta = new Tandem.Delta(0, ops)
    return delta

  updateLine: (line) ->
    return line.rebuild()


module.exports = ScribeDocument
