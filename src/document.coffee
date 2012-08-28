#= require underscore
#= require linked_list
#= require tandem/line


class TandemDocument
  constructor: (@editor) ->
    @doc = @editor.iframeDoc
    @root = @doc.body
    this.rebuildLines()

  appendLine: (lineNode) ->
    line = new Tandem.Line(this, lineNode)
    @lines.append(line)
    @lineMap[line.id] = line
    return line

  buildLines: ->
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
    line = this.findLine(lineNode)
    return line.findLeaf(node)

  findLine: (node) ->
    return @lineMap[node.id]

  findLineAtOffset: (index) ->
    [lineNode, offset] = Tandem.Utils.Node.getChildAtOffset(@root, index)
    line = this.findLine(lineNode)
    return [line, offset]

  normalizeHtml: ->
    ### Rules:
    - All direct children are divs with class line and an id in the form "tandem-#{counter}"
    - Newline are represented by <div> only. For newline only lines, it's <div><br /><div>
    - An empty document still have one <div> container
    - Only allowed sub-nodes are <b>, <i>, <s>, <u>, <span>, <br />, Otherwise tags are stripped
      - Exception: Equivalent tags are converted: <strong> -> <b>
    - No HTML text nodes allowed, unformatted text are wrapped in spans
    ### 
    
    if @root.childNodes.length == 0
      div = @doc.createElement('div')
      div.appendChild(@doc.createElement('br'))
      @root.appendChild(div)
      this.appendLine(div, 0)

    # Flatten block elements
    # Make all block elements div
    # Normalize all inline block tags

  normalizeNodeHtml: (node) ->

  rebuildLines: ->
    @lines = new LinkedList()
    @lineMap = {}
    this.normalizeHtml()
    this.buildLines()

  splitLine: (line, offset) ->
   [lineNode1, lineNode2] = Tandem.Utils.Node.split(line.node, offset, true)
   line.node = lineNode1
   line.rebuild()
   newLine = new Tandem.Line(this, lineNode2)
   @lines.insertAfter(line, newLine)
   @lineMap[newLine.id] = newLine



window.Tandem ||= {}
window.Tandem.Document = TandemDocument
