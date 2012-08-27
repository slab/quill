#= require underscore
#= require tandem/line


class TandemDocument

  constructor: (@editor) ->
    @doc = @editor.iframeDoc
    @root = @doc.body
    @lineIdCounter = 1
    @lines = []
    @lineMap = {}
    this.normalizeHtml()
    this.buildLines()

  buildLines: ->
    @lines = _.map(@root.childNodes, (lineNode, index) =>
      line = new Tandem.Line(this, lineNode, @lineIdCounter, index)
      lineNode.id = Tandem.Line.ID_PREFIX + @lineIdCounter
      lineNode.className = Tandem.Line.CLASS_NAME
      @lineMap[lineNode.id] = line
      @lineIdCounter += 1
      return line
    )

  findLine: (node) ->
    return @lineMap[node.id]

  findLeaf: (node) ->
    lineNode = node.parentNode
    while lineNode? && !Tandem.Line.isLineNode(lineNode)
      lineNode = lineNode.parentNode
    line = this.findLine(lineNode)
    return line.findLeaf(node)

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
      div.id = Tandem.Line.ID_PREFIX + @idCounter
      @lineIdCounter += 1

    # Remove empty lines
    lines = _.clone(@editor.iframeDoc.body.childNodes)
    _.each(lines, (line) ->
      if line.textContent == '' && !_.any(line.childNodes, (node) -> return node.tagName == 'BR')
        line.parentNode.removeChild(line)
    )

    # Flatten block elements
    # Make all block elements div
    # Normalize all inline block tags

  normalizeNodeHtml: (node) ->


  detectChange: ->
    # Go through HTML (which should be normalized)
    # Make sure non are different from their innerHTML, if so record change
    # Returns changes made



window.Tandem ||= {}
window.Tandem.Document = TandemDocument
