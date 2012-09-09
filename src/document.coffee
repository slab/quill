#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/line


class TandemDocument
  constructor: (@editor) ->
    @doc = @editor.iframeDoc
    @root = @doc.body
    this.buildLines()

  appendLine: (lineNode) ->
    line = new Tandem.Line(this, lineNode)
    @lines.append(line)
    @lineMap[line.id] = line
    return line

  buildLines: ->
    @lines = new LinkedList()
    @lineMap = {}
    this.normalizeHtml()
    _.each(@root.childNodes, (node) =>
      this.appendLine(node)
    )

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
    return @lineMap[node.id]

  findLineAtOffset: (index) ->
    [lineNode, offset] = Tandem.Utils.getChildAtOffset(@root, index)
    line = this.findLine(lineNode)
    return [line, offset]

  findLineNode: (node) ->
    while node? && !Tandem.Line.isLineNode(node)
      node = node.parentNode
    return node

  insertLineBefore: (newLineNode, refLine) ->
    line = new Tandem.Line(this, newLineNode)
    @lines.insertAfter(refLine.prev, line)
    @lineMap[line.id] = line
    return line

  normalizeHtml: ->
    if @root.childNodes.length == 0
      div = @doc.createElement('div')
      @root.appendChild(div)
      this.appendLine(div)
    else
      _.each(_.clone(@root.childNodes), (child) ->
        if child.nodeType != child.ELEMENT_NODE
          child.parentNode.removeChild(child)
        else
          Tandem.Utils.breakBlocks(child)
      )

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Tandem.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    line.rebuild()
    newLine = new Tandem.Line(this, lineNode2)
    @lines.insertAfter(line, newLine)
    @lineMap[newLine.id] = newLine

  toDelta: ->
    lines = @lines.toArray()
    length = 0
    deltas = _.each(lines.length, (line, index) ->
      deltas = line.delta.deltas
      length += line.delta.endLength
      if index < lines.length - 1
        deltas.push(new JetInsert("\n"))
        length += 1
      return deltas
    )
    deltas = _.flatten(deltas, true)
    delta = new JetDelta(0, length, deltas)
    delta.compact()
    return delta



window.Tandem ||= {}
window.Tandem.Document = TandemDocument
