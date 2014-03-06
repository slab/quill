_                   = require('underscore')
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
    _.each(@root.childNodes, (node) =>
      this.appendLine(node)
    )

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
    _.each(_.clone(lineToMerge.node.childNodes), (child) ->
      line.node.appendChild(child)
    )
    ScribeDOM.removeNode(lineToMerge.node)
    this.removeLine(lineToMerge)
    line.trailingNewline = lineToMerge.trailingNewline
    line.rebuild()

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)

  splitLine: (line, offset) ->
    if offset != line.length or line.trailingNewline
      [lineNode1, lineNode2] = ScribeUtils.splitNode(line.node, offset, true)
      line.node = lineNode1
      trailingNewline = line.trailingNewline
      line.trailingNewline = true
      this.updateLine(line)
      newLine = this.insertLineBefore(lineNode2, line.next)
      newLine.trailingNewline = trailingNewline
      newLine.resetContent()
      return newLine
    else
      line.trailingNewline = true
      line.resetContent()
      return line

  toDelta: ->
    lines = @lines.toArray()
    ops = _.flatten(_.map(lines, (line, index) ->
      return line.delta.ops
    ), true)
    delta = new Tandem.Delta(0, ops)
    return delta

  updateLine: (line) ->
    return line.rebuild()


module.exports = ScribeDocument
