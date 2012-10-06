#= require underscore
#= require linked_list
#= require jetsync
#= require tandem/line


class TandemDocument
  @INDENT_PREFIX: 'indent-'


  @fixListNumbering: (root) ->
    ols = root.querySelectorAll('ol')
    _.each(ols, (ol) ->
      indent = Tandem.Utils.getIndent(ol)
      previous = ol.previousSibling
      while true
        if !previous? || previous.tagName != 'OL'
          return ol.setAttribute('start', 1)
        else
          prevIndent = Tandem.Utils.getIndent(previous)
          if prevIndent < indent
            return ol.setAttribute('start', 1)
          else if prevIndent == indent
            return ol.setAttribute('start', parseInt(previous.getAttribute('start')) + 1)
          else
            previous = previous.previousSibling
    )

  @normalizeHtml: (root, options = {}) ->
    if root.childNodes.length == 0
      div = root.ownerDocument.createElement('div')
      return root.appendChild(div)
    _.each(_.clone(root.childNodes), (child) =>
      if child.nodeType != child.ELEMENT_NODE
        child.parentNode.removeChild(child)
      else
        # TODO editor.update should mark dirty lines
        if options.ignoreDirty || child.classList.contains(Tandem.Line.DIRTY_CLASS) || true
          _.each(Tandem.Constants.BREAK_TAGS, (tagName) ->
            tags = child.querySelectorAll(tagName)
            _.each(tags, (tag) ->
              tag.textContent = "\n"
            )
          )
          lineNodes = Tandem.Utils.breakBlocks(child)
          _.each(lineNodes, (lineNode) ->
            Tandem.Line.normalizeHtml(lineNode)
          )
    )
    TandemDocument.fixListNumbering(root)


  constructor: (@editor, @root) ->
    this.buildLines()

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  buildLines: ->
    this.reset()
    TandemDocument.normalizeHtml(@root, {ignoreDirty: true})
    this.rebuild()

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
      # All leaves should still be in the DOM
      orphanedLeaf = orphanedLine = null
      if _.any(lines, (line) ->
        return _.any(line.leaves.toArray(), (leaf) ->
          if leaf.node.parentNode == null
            orphanedLeaf = leaf
            orphanedLine = line
            return true
          return false
        )
      )
        console.error 'Missing from DOM', orphanedLine, orphanedLeaf
        return false

      # @lines should match nodesByLine
      if lines.length != nodesByLine.length
        console.error "@lines and nodesByLine differ in length"
        return false
      return false if _.any(lines, (line, index) =>
        if line.length != line.node.textContent.length
          console.error line, line.length, line.node.textContent.length, 'differ in length'
          return true
        leaves = line.leaves.toArray()
        leafNodes = _.map(leaves, (leaf) -> return leaf.node)
        if !_.isEqual(leafNodes, nodesByLine[index])
          console.error leafNodes, 'nodes differ from', nodesByLine[index]
          return true
        leaves = _.map(leaves, (leaf) -> 
          return _.pick(leaf, 'attributes', 'length', 'line', 'node', 'text')
        )
        line.rebuild()
        rebuiltLeaves = _.map(line.leaves.toArray(), (leaf) -> 
          return _.pick(leaf, 'attributes', 'length', 'line', 'node', 'text')
        )
        if !_.isEqual(leaves, rebuiltLeaves)
          console.error leaves, 'leaves differ from', rebuiltLeaves
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
    if refLine != null
      @lines.insertAfter(refLine.prev, line)
    else
      @lines.append(line)
    @lineMap[line.id] = line
    @length += line.length
    @length += 1 if @lines.length > 1
    return line

  printLines: ->
    lines = @lines.toArray() 
    console.info lines.length
    _.each(lines, (line) ->
      console.info line, line.id, line.node.textContent
    )

  rebuild: ->
    this.reset()
    _.each(@root.childNodes, (node) =>
      this.appendLine(node)
    )

  rebuildDirty: ->
    dirtyNodes = @root.getElementsByClassName(Tandem.Line.DIRTY_CLASS)
    _.each(_.clone(dirtyNodes), (lineNode) =>
      lineNode.classList.remove(Tandem.Line.DIRTY_CLASS)
      line = this.findLine(lineNode)
      this.updateLine(line) if line?
    )

  removeLine: (line) ->
    delete @lineMap[line.id]
    @lines.remove(line)
    @length -= line.length + 1

  reset: ->
    @lines = new LinkedList()
    @lineMap = {}
    @length = 0

  splitLine: (line, offset) ->
    [lineNode1, lineNode2] = Tandem.Utils.splitNode(line.node, offset, true)
    line.node = lineNode1
    this.updateLine(line)
    this.insertLineBefore(lineNode2, line.next)

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
