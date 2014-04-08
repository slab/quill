_             = require('lodash')
LinkedList    = require('linked-list')
DOM           = require('./dom')
Format        = require('./format')
Line          = require('./line')
Normalizer    = require('./normalizer')
Utils         = require('./utils')
Tandem        = require('tandem-core')


class Document
  constructor: (@root, options = {}) ->
    @normalizer = new Normalizer(@root)
    @formats = {}
    this.setHTML(@root.innerHTML)

  addFormat: (name, config) ->
    console.warn('Overwriting format', name, @formats[name]) if @formats[name]?
    @formats[name] = new Format(config)
    @normalizer.addTag(config.tag) if config.tag?
    @normalizer.addStyle(config.style) if config.style?

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  findLeaf: (node) ->
    lineNode = this.findLineNode(node)
    line = this.findLine(lineNode)
    return line.findLeaf(node)

  findLine: (node) ->
    node = this.findLineNode(node)
    return if node? then @lineMap[node.id] else null

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

  setHTML: (html) ->
    @lines = new LinkedList()
    @lineMap = {}
    @root.innerHTML = Normalizer.normalizeHTML(html)
    @normalizer.normalizeDoc()
    _.each(DOM.getChildNodes(@root), _.bind(this.appendLine, this))

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
