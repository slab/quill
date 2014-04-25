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
    return [null, index] unless @lines.length > 0
    length = this.toDelta().endLength     # TODO optimize
    return [@lines.last, @lines.last.length] if index == length
    return [null, index - length] if index > length
    curLine = @lines.first
    while curLine?
      return [curLine, index] if index < curLine.length
      index -= curLine.length
      curLine = curLine.next
    return [null, index]    # Should never occur unless length calculation is off

  insertLineBefore: (newLineNode, refLine) ->
    line = new Line(this, newLineNode)
    if refLine?
      @root.insertBefore(newLineNode, refLine.node) unless DOM.isElement(newLineNode.parentNode)
      @lines.insertAfter(refLine.prev, line)
    else
      @root.appendChild(newLineNode) unless DOM.isElement(newLineNode.parentNode)
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  mergeLines: (line, lineToMerge) ->
    if lineToMerge.length > 1
      DOM.removeNode(line.leaves.last.node) if line.length == 1
      _.each(DOM.getChildNodes(lineToMerge.node), (child) ->
        line.node.appendChild(child) if child.tagName != DOM.DEFAULT_BREAK_TAG
      )
    this.removeLine(lineToMerge)
    line.rebuild()

  optimizeLines: ->
    # TODO optimize algorithm (track which lines get dirty and only Normalize.optimizeLine those)
    _.each(@lines.toArray(), (line, i) ->
      line.optimize()
      return true    # line.optimize() might return false, prevent early break
    )

  rebuild: ->
    lines = @lines.toArray()
    lineNode = @root.firstChild
    _.each(lines, (line, index) =>
      while line.node != lineNode
        if line.node.parentNode == @root
          # New line inserted
          lineNode = Normalizer.normalizeLine(lineNode)
          newLine = this.insertLineBefore(lineNode, line)
          lineNode = lineNode.nextSibling
        else
          # Existing line removed
          return this.removeLine(line)
      if line.outerHTML != lineNode.outerHTML
        # Existing line changed
        line.node = Normalizer.normalizeLine(line.node)
        line.rebuild()
      lineNode = line.node.nextSibling
    )
    # New lines appended
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
    @lines = new LinkedList()
    @lineMap = {}
    this.rebuild()

  splitLine: (line, offset) ->
    offset = Math.min(offset, line.length - 1)
    [lineNode1, lineNode2] = Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    line.rebuild()
    newLine = this.insertLineBefore(lineNode2, line.next)
    return newLine

  toDelta: ->
    lines = @lines.toArray()
    ops = _.flatten(_.map(lines, (line) ->
      return _.clone(line.delta.ops)
    ), true)
    return new Tandem.Delta(0, ops)


module.exports = Document
