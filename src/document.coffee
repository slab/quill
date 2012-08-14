#= require underscore

ID_PREFIX   = 'tandem-'
CLASS_NAME  = 'line'
BLOCK_TAGS  = ['ADDRESS', 'BLOCKQUOTE', 'DIV', 'DL', 'FIELDSET', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'OL', 'P', 'PRE', 'TABLE', 'UL']
INLINE_TAGS = []

class TandemDocument
  constructor: (@editor, @root) ->
    @idCounter = 0
    lines = []
    lineMap = {}
    this.normalizeHtml()
    this.detectChange()

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
      div.id = ID_PREFIX + @idCounter
      @idCounter += 1

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
