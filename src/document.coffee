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
    @formats = {}
    _.each(options.formats, (name) =>
      this.addFormat(name)
    )
    this.setHTML(@root.innerHTML)

  addFormat: (name, config) ->
    config = Format.FORMATS[name] unless config?
    console.warn('Overwriting format', name, @formats[name]) if @formats[name]?
    @formats[name] = new Format(config)

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  findLeaf: (node) ->
    line = this.findLine(node)
    return line.findLeaf(node)

  findLine: (node) ->
    while node? and !Utils.isLineNode(node)
      node = node.parentNode
    return if node? then @lineMap[node.id] else null

  findLineAt: (index) ->
    curLine = @lines.first
    while curLine?
      return [curLine, index] if index <= curLine.length
      index -= curLine.length + 1
      curLine = curLine.next
    return [null, index]

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
    @root.innerHTML = Normalizer.stripWhitespace(html)
    lineNode = @root.firstChild
    while lineNode?
      this.appendLine(Normalizer.normalizeLine(lineNode))
      lineNode = lineNode.nextSibling

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    line.rebuild()
    newLine = this.insertLineBefore(lineNode2, line.next)
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


module.exports = Document
