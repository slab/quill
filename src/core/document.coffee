_          = require('lodash')
Delta      = require('rich-text/lib/delta')
dom        = require('../lib/dom')
Format     = require('./format')
Line       = require('./line')
LinkedList = require('../lib/linked-list')
Normalizer = require('./normalizer')


class Document
  constructor: (@root, options = {}) ->
    @normalizer = new Normalizer()
    @formats = {}
    _.each(options.formats, _.bind(this.addFormat, this))
    this.setHTML(@root.innerHTML)

  addFormat: (name, config) ->
    config = Format.FORMATS[name] unless _.isObject(config)
    console.warn('Overwriting format', name, @formats[name]) if @formats[name]?
    @formats[name] = new Format(config)
    @normalizer.addFormat(config)

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  findLeafAt: (index, inclusive) ->
    [line, offset] = this.findLineAt(index)
    return if line? then line.findLeafAt(offset, inclusive) else [undefined, offset]

  findLine: (node) ->
    while node? and !dom.BLOCK_TAGS[node.tagName]?
      node = node.parentNode
    line = if node? then dom(node).data(Line.DATA_KEY) else undefined
    return if line?.node == node then line else undefined

  findLineAt: (index) ->
    return [undefined, index] unless @lines.length > 0
    length = this.toDelta().length()     # TODO optimize
    return [@lines.last, @lines.last.length] if index == length
    return [undefined, index - length] if index > length
    curLine = @lines.first
    while curLine?
      return [curLine, index] if index < curLine.length
      index -= curLine.length
      curLine = curLine.next
    return [undefined, index]    # Should never occur unless length calculation is off

  getHTML: ->
    # Preserve spaces between tags
    return @root.innerHTML.replace(/\>\s+\</g, '>&nbsp;<')

  insertLineBefore: (newLineNode, refLine) ->
    line = new Line(this, newLineNode)
    if refLine?
      @root.insertBefore(newLineNode, refLine.node) unless dom(newLineNode.parentNode).isElement()  # Would prefer newLineNode.parentNode? but IE will have non-null object
      @lines.insertAfter(refLine.prev, line)
    else
      @root.appendChild(newLineNode) unless dom(newLineNode.parentNode).isElement()
      @lines.append(line)
    return line

  mergeLines: (line, lineToMerge) ->
    if lineToMerge.length > 1
      dom(line.leaves.last.node).remove() if line.length == 1
      _.each(dom(lineToMerge.node).childNodes(), (child) ->
        line.node.appendChild(child) if child.tagName != dom.DEFAULT_BREAK_TAG
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
    lineNode = lineNode.firstChild if lineNode? and dom.LIST_TAGS[lineNode.tagName]?
    _.each(lines, (line, index) =>
      while line.node != lineNode
        if lineNode and (line.node.parentNode == @root or line.node.parentNode?.parentNode == @root)
          # New line inserted
          lineNode = @normalizer.normalizeLine(lineNode)
          newLine = this.insertLineBefore(lineNode, line)
          lineNode = dom(lineNode).nextLineNode(@root)
        else
          # Existing line removed
          return this.removeLine(line)
      if line.outerHTML != lineNode.outerHTML
        # Existing line changed
        line.node = @normalizer.normalizeLine(line.node)
        line.rebuild()
      lineNode = dom(lineNode).nextLineNode(@root)
    )
    # New lines appended
    while lineNode?
      lineNode = @normalizer.normalizeLine(lineNode)
      this.appendLine(lineNode)
      lineNode = dom(lineNode).nextLineNode(@root)

  removeLine: (line) ->
    if line.node.parentNode?
      if dom.LIST_TAGS[line.node.parentNode.tagName] and line.node.parentNode.childNodes.length == 1
        dom(line.node.parentNode).remove()
      else
        dom(line.node).remove()
    @lines.remove(line)

  setHTML: (html) ->
    html = Normalizer.stripComments(html)
    html = Normalizer.stripWhitespace(html)
    @root.innerHTML = html
    @lines = new LinkedList()
    this.rebuild()

  splitLine: (line, offset) ->
    offset = Math.min(offset, line.length - 1)
    [lineNode1, lineNode2] = dom(line.node).split(offset, true)
    line.node = lineNode1
    line.rebuild()
    newLine = this.insertLineBefore(lineNode2, line.next)
    newLine.formats = _.clone(line.formats)
    newLine.resetContent()
    return newLine

  toDelta: ->
    lines = @lines.toArray()
    delta = new Delta()
    _.each(lines, (line) ->
      _.each(line.delta.ops, (op) ->
        delta.push(op)
      )
    )
    return delta


module.exports = Document
