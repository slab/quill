#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/line


class TandemDocument
  constructor: (@editor, @root) ->
    this.buildLines()

  appendLine: (lineNode) ->
    line = new Tandem.Line(this, lineNode)
    @lines.append(line)
    @lineMap[line.id] = line
    @length += line.length
    @length += 1 if @lines.length > 1
    return line

  buildLines: ->
    this.normalizeHtml()
    @lines = new LinkedList()
    @lineMap = {}
    @length = 0
    _.each(@root.childNodes, (node) =>
      this.appendLine(node)
    )

  # Makes sure our data structures are consistent
  checkConsistency: (output = false) ->
    nodesByLine = _.map(@root.childNodes, (lineNode) ->
      nodes = lineNode.querySelectorAll('*')
      return _.filter(nodes, (node) ->
        return node.nodeType == node.ELEMENT_NODE && (node.nodeName == 'BR' || node.firstChild.nodeType == node.TEXT_NODE)
      )
    )
    lines = @lines.toArray()

    isConsistent = =>
      # @lines and @lineMap should match
      if lines.length != _.values(@lineMap).length
        console.error "@lines and @lineMap differ in length", lines.length, _.values(@lineMap).length
        return false
      return false if _.any(lines, (line) =>
        if !line? || @lineMap[line.id] != line
          if line?
            console.error line, "does not match", @lineMap[line.id]
          else
            console.error "null line"
          return true
        return false
      )
      # @lines should match nodesByLine
      if lines.length != nodesByLine.length
        console.error "@lines and nodesByLine differ in length"
        return false
      return false if _.any(lines, (line, index) =>
        leafNodes = _.map(line.leaves.toArray(), (leaf) -> return leaf.node)
        if !_.isEqual(leafNodes, nodesByLine[index])
          console.error leafNodes, 'differs from', nodesByLine[index]
          return true
        return false
      )
      return true

    if isConsistent()
      return true
    else
      if output
        console.error @root
        console.error nodesByLine 
        console.error lines
        console.error @lineMap
      return false

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
    @length += line.length
    @length += 1 if @lines.length > 1
    return line

  normalizeHtml: ->
    if @root.childNodes.length == 0
      div = @root.ownerDocument.createElement('div')
      @root.appendChild(div)
    else
      _.each(_.clone(@root.childNodes), (child) ->
        if child.nodeType != child.ELEMENT_NODE
          child.parentNode.removeChild(child)
        else
          Tandem.Utils.breakBlocks(child)
      )
    _.each(@root.getElementsByClassName(Tandem.Line.DIRTY_CLASS), (lineNode) =>
      line = this.findLine(lineNode)
      line.rebuild() if line?
    )

  printLines: ->
    lines = @lines.toArray() 
    console.info lines.length
    _.each(lines, (line) ->
      console.info line.id, line.node.textContent
    )

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)
    @length -= line.length + 1

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Tandem.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    line.rebuild()
    newLine = new Tandem.Line(this, lineNode2)
    @lines.insertAfter(line, newLine)
    @lineMap[newLine.id] = newLine
    @length += 1

  toDelta: ->
    lines = @lines.toArray()
    deltas = _.flatten(_.map(lines, (line, index) ->
      lineDeltas = JetDelta.copy(line.delta).deltas
      if index < lines.length - 1
        lineDeltas.push(new JetInsert("\n"))
      return lineDeltas
    ), true)
    delta = new JetDelta(0, @length, deltas)
    delta.compact()
    return delta

  updateLine: (line) ->
    @length -= line.length
    line.rebuild()
    @length += line.length



window.Tandem ||= {}
window.Tandem.Document = TandemDocument
