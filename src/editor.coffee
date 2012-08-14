#= require underscore
#= require document
#= require selection
#= require rangy-core
#= require eventemitter2
#= require jetsync

class TandemEditor extends EventEmitter2
  events: 
    API_TEXT_CHANGE       : 'api-text-change'
    USER_SELECTION_CHANGE : 'user-selection-change'
    USER_TEXT_CHANGE      : 'user-text-change'

  constructor: (@container) ->
    @container = document.getElementById(@container) if _.isString(@container)
    @iframe = this._createIframe(@container)
    @iframeDoc = @iframe.contentWindow.document
    @doc = new Tandem.Document(this, @iframeDoc.body)
    @ignoreDomChanges = false
    rangy.init()
    @currentSelection = this.getSelectionRange()
    # Normalize html
    this.initListeners()

  _appendStyles: (doc) ->
    head = doc.getElementsByTagName('head')[0]
    style = doc.createElement('style')
    style.type = 'text/css'
    css = "
      body { 
        font-family: 'Helvetica', 'Arial', san-serif;
        font-size: 13px;
        margin: 0px; 
        padding: 0px; 
      }
      .line { min-height: 15px; }
      a { text-decoration: underline; }
      b { font-weight: bold; }
      i { font-style: italic; }
      s { text-decoration: line-through; }
      u { text-decoration: underline; }
    "
    if style.styleSheet?
      style.styleSheet.cssText = css
    else
      style.appendChild(doc.createTextNode(css))
    head.appendChild(style)

  _createIframe: (parent) ->
    html = parent.innerHTML
    parent.innerHTML = ''
    iframe = document.createElement('iframe')
    iframe.frameborder = 0
    iframe.src = 'javascript:;'
    iframe.height = '100%'
    iframe.width = '100%'
    parent.appendChild(iframe)
    doc = iframe.contentWindow.document
    this._appendStyles(doc)
    doc.body.setAttribute('contenteditable', true)
    doc.body.innerHTML = html
    return iframe

  initListeners: ->
    @iframeDoc.body.addEventListener('DOMSubtreeModified', _.debounce((event) ->
      return if @ignoreDomChanges
      # Normalize
      # Detect changes
      # Callback
      console.log 'DOMSubtreeModified'
    , 100))
    checkSelectionChange = _.debounce( =>
      selection = this.getSelectionRange()
      if selection != @currentSelection && !selection.equals(@currentSelection)
        this.emit(this.events.USER_SELECTION_CHANGE, selection)
        @currentSelection = selection
    , 100)
    @iframeDoc.body.addEventListener('keyup', checkSelectionChange)
    @iframeDoc.body.addEventListener('mouseup', checkSelectionChange)


  insertAt: (startIndex, text, attributes = {}) ->
    @ignoreDomChanges = true
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex) else startIndex
    this.preserveSelection(range, text.length, ->

    )
    @ignoreDomChanges = false
    # 1. Save selection
    # 2. Split text into lines
    # 3. Find node where it starts
    # 4. Insert text of first line
    # 5. Append <div> wrapped text for remaining lines
    # - Update local data structures?
    # - Apply attributes if applicable
    # 6. Restore selection

  deleteAt: (startIndex, length) ->  
    @ignoreDomChanges = true
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex + length) else startIndex
    this.preserveSelection(range, 0 - length, =>
      lineGroups = range.groupNodesByLine()
      lines = _.compact(_.map(lineGroups, (lineGroup) ->
        return if lineGroup.length != 0 then Tandem.Utils.Node.getLine(lineGroup[0]) else null
      ))
      lines.unshift(Tandem.Utils.Node.getLine(range.start.node))
      lines.push(Tandem.Utils.Node.getLine(range.end.node))
      lines = _.uniq(lines)
      return if lines.length == 0
      if lines.length > 2
        toDelete = lines.splice(0, lines.length - 2)
        _.each(toDelete, (line) ->
          line.parentNode.removeChild(line)
        )
      if range.start.node == range.end.node
        range.start.node.textContent = range.start.node.textContent.substr(0, range.start.offset) + range.end.node.textContent.substr(range.end.offset)
      else
        nodes = _.flatten(lineGroups)
        _.each(nodes, (node) ->
          if node != range.start.node && node != range.end.node
            node.parentNode.removeChild(node)
        )
        range.end.node.textContent = range.end.node.textContent.substr(range.end.offset)
        range.start.node.textContent = range.start.node.textContent.substr(0, range.start.offset)
      if lines.length == 2
        Tandem.Utils.Node.combineLines(lines[0], lines[1])
    )
    @ignoreDomChanges = false

  getAt: (startIndex, length) ->
    # - Returns array of {text: "", attr: {}}
    # 1. Get all nodes in the range
    # 2. For first and last, change the text
    # 3. Return array
    # - Helper to get nodes in given index range
    # - In the case of 0 lenght, text will always be "", but attributes should be properly applied

  getSelectionRange: ->
    return Tandem.Range.getCurrent(this)

  # applyAttribute: (TandemRange range, Object attribute) ->
  # applyAttribute: (Number startIndex, Number length, Object attribute) ->
  applyAttribute: (startIndex, length, attributes, emitEvent = true) ->
    @ignoreDomChanges = true
    if !_.isNumber(startIndex)
      [range, attributes] = [startIndex, length]
      startIndex = range.start.getIndex()
      length = range.end.getIndex() - startIndex
    this.preserveSelection(range, 0, =>
      for attr,value of attributes
        range = new Tandem.Range(this, startIndex, startIndex + length) unless range?
        range.splitEnds()
        _.each(range.groupNodesByLine(), (nodes) =>
          return if nodes.length == 0
          if value
            _.each(nodes, (node) =>
              container = Tandem.Utils.Node.createContainerForAttribute(@iframeDoc, attr)
              Tandem.Utils.Node.wrap(container, node)
            )
          else
            tagName = Tandem.Utils.Attribute.getTagName(attr)
            roots = _.compact(_.uniq(_.map(nodes, (node) ->
              return Tandem.Utils.Node.getAncestorAttribute(node, attr, true)
            )))
            return if roots.length == 0
            rootStartPosition = new Tandem.Position(@editor, roots[0], 0)
            rootEndPosition = new Tandem.Position(@editor, roots[roots.length - 1], roots[roots.length - 1].textContent.length - 1)
            rootStartIndex = rootStartPosition.getIndex()
            rootEndIndex = rootEndPosition.getIndex()
            _.each(roots, (root) =>
              Tandem.Utils.Node.removeKeepingChildren(@iframeDoc, root)
            )
            attribute = {}
            attribute[attr] = true
            if rootStartIndex < startIndex
              this.applyAttribute(rootStartIndex, startIndex - rootStartIndex, attribute, false)
            if startIndex + length < rootEndIndex
              this.applyAttribute(startIndex + length, rootEndIndex - startIndex - length + 1, attribute, false)
        )
    )
    if emitEvent
      docLength = @iframeDoc.body.textContent.length + @iframeDoc.body.childNodes.length - 1
      deltas = []
      deltas.push(new JetRetain(0, startIndex)) if startIndex > 0
      deltas.push(new JetRetain(startIndex, startIndex + length, attributes))
      deltas.push(new JetRetain(startIndex + length, docLength)) if startIndex + length < docLength
      delta = new JetDelta(docLength, docLength, deltas)
      this.emit(this.events.API_TEXT_CHANGE, delta)
    @ignoreDomChanges = false
    
  preserveSelection: (modificationRange, charAdditions, fn) ->
    currentSelection = this.getSelectionRange()
    if currentSelection?
      selectionStartIndex = currentSelection.start.getIndex()
      selectionEndIndex = currentSelection.end.getIndex()
      fn()
      savedSelectionRange = new Tandem.Range(currentSelection.editor, selectionStartIndex, selectionEndIndex)
      rangySel = rangy.getIframeSelection(@iframe)
      range = savedSelectionRange.getRangy()
      rangySel.setSingleRange(range)
    else
      fn()


window.Tandem ||= {}
window.Tandem.Editor = TandemEditor
