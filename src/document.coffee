_          = require('lodash')
DOM        = require('./dom')
Format     = require('./format')
Line       = require('./line')
LinkedList = require('./lib/linked-list')
Normalizer = require('./normalizer')
Utils      = require('./utils')
Tandem     = require('tandem-core')


class Document
  constructor: (@root, options = {}) ->
    @formats = {}
    _.each(options.formats, _.bind(this.addFormat, this))
    this.setHTML(@root.innerHTML)

  addFormat: (name, config) ->
    config = Format.FORMATS[name] unless _.isObject(config)
    console.warn('Overwriting format', name, @formats[name]) if @formats[name]?
    @formats[name] = new Format(config)

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  findLine: (node) ->
    while node? and node.parentNode != @root
      node = node.parentNode
    line = if node? then @lineMap[node.id] else null
    return if line?.node == node then line else null

  findLineAt: (index) ->
    length = this.toDelta().endLength     # TODO optimize
    return [@lines.last, 0] if index == length
    return [null, index - length] if index > length
    curLine = @lines.first
    while curLine?
      return [curLine, index] if index <= curLine.length + 1
      index -= curLine.length + 1
      curLine = curLine.next
    return [null, index]    # Should never occur unless length calculation is off

  insertLineBefore: (newLineNode, refLine) ->
    line = new Line(this, newLineNode)
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  mergeLines: (line, lineToMerge) ->
    unless lineToMerge.isNewline()
      DOM.removeNode(line.leaves.first.node) if line.isNewline()
      _.each(DOM.getChildNodes(lineToMerge.node), (child) ->
        line.node.appendChild(child) if child.tagName != DOM.DEFAULT_BREAK_TAG
      )
    this.removeLine(lineToMerge)
    line.rebuild()

  rebuild: ->
    @lines = new LinkedList()
    @lineMap = {}
    lineNode = @root.firstChild
    while lineNode?
      lineNode = Normalizer.normalizeLine(lineNode)
      this.appendLine(lineNode)
      lineNode = lineNode.nextSibling

  removeLine: (line) ->
    DOM.removeNode(line.node) if line.node.parentNode == @root
    delete @lineMap[line.id]
    @lines.remove(line)

  setHTML: (html) ->
    @root.innerHTML = Normalizer.stripWhitespace(html)
    this.rebuild()

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
