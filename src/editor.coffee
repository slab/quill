#= require underscore
#= require document
#= require selection
#= require rangy-core
#= require eventemitter2
#= require diff_match_patch
#= require jetsync

class TandemEditor extends EventEmitter2
  @editors: []

  events: 
    API_TEXT_CHANGE       : 'api-text-change'
    USER_SELECTION_CHANGE : 'user-selection-change'
    USER_TEXT_CHANGE      : 'user-text-change'

  options:
    POLL_INTERVAL: 500

  constructor: (@container) ->
    @container = document.getElementById(@container) if _.isString(@container)
    @iframe = this.createIframe(@container)
    @iframeDoc = @iframe.contentWindow.document
    @doc = new Tandem.Document(this, @iframeDoc.body)
    @ignoreDomChanges = false
    @currentSelection = null
    this.initContentListeners()
    this.initSelectionListeners()
    TandemEditor.editors.push(this)

  createIframe: (parent) ->
    html = parent.innerHTML
    parent.innerHTML = ''
    iframe = document.createElement('iframe')
    iframe.frameborder = 0
    iframe.src = 'javascript:;'
    iframe.height = iframe.width = '100%'
    parent.appendChild(iframe)
    doc = iframe.contentWindow.document
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
    doc.body.setAttribute('contenteditable', true)
    doc.body.innerHTML = html
    return iframe

  initContentListeners: ->
    @iframeDoc.body.addEventListener('DOMCharacterDataModified', (event) =>
      @currentSelection = this.getSelection()
      return if @ignoreDomChanges
      docLength = @iframeDoc.body.textContent.length + @iframeDoc.body.childNodes.length - 1
      originalDocLength = docLength - (event.newValue.length - event.prevValue.length)
      deltas = []
      position = new Tandem.Position(this, event.srcElement.parentNode, 0)
      startIndex = position.getIndex()
      deltas.push(new JetRetain(0, startIndex)) if startIndex > 0
      insertedLength = 0
      offsetLength = 0
      dmp = new diff_match_patch()
      diffs = dmp.diff_main(event.prevValue, event.newValue)
      _.each(diffs, (diff) ->
        if diff[0] == DIFF_EQUAL
          deltas.push(new JetRetain(startIndex + offsetLength, startIndex + offsetLength + diff[1].length))
          offsetLength += diff[1].length
        if diff[0] == DIFF_INSERT
          deltas.push(new JetInsert(diff[1]))
          insertedLength += diff[1].length
        if diff[0] == DIFF_DELETE
          offsetLength += diff[1].length
      )
      deltas.push(new JetRetain(startIndex + offsetLength, originalDocLength)) if startIndex < docLength
      delta = new JetDelta(originalDocLength, docLength, deltas)
      this.emit(this.events.USER_TEXT_CHANGE, delta)
    )
    @iframeDoc.body.addEventListener('keydown', (event) =>
      return if @ignoreDomChanges || event.which != 13
      @currentSelection = this.getSelection()
      @ignoreDomChanges = true
      selection = this.getSelection()
      startIndex = selection.start.getIndex()
      docLength = @iframeDoc.body.textContent.length + @iframeDoc.body.childNodes.length - 1
      deltas = []
      deltas.push(new JetRetain(0, startIndex)) if startIndex > 0
      deltas.push(new JetInsert("\n"))
      deltas.push(new JetRetain(startIndex, docLength)) if startIndex < docLength
      delta = new JetDelta(docLength, docLength + 1, deltas)
      this.emit(this.events.USER_TEXT_CHANGE, delta)
      setTimeout(=>
        @ignoreDomChanges = false
      , 1)
    )

  initSelectionListeners: ->
    checkSelectionChange = =>
      selection = this.getSelection()
      if selection != @currentSelection && !selection.equals(@currentSelection)
        this.emit(this.events.USER_SELECTION_CHANGE, selection)
        @currentSelection = selection

    @iframeDoc.body.addEventListener('keyup', _.debounce(checkSelectionChange, 100))
    @iframeDoc.body.addEventListener('mouseup', _.debounce(checkSelectionChange, 100))
    setInterval(checkSelectionChange, this.options.POLL_INTERVAL)

  insertAt: (startIndex, text, attributes = {}) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    [position, startIndex] = Tandem.Utils.Input.normalizePosition(this, startIndex)

    this.preserveSelection(position, text.length, =>
      lines = text.split("\n")
      _.each(lines, (line, lineIndex) =>
        position = new Tandem.Position(this, startIndex) unless position?
        this.insertTextAt(position, line)
        startIndex += line.length
        if lineIndex < lines.length - 1
          this.insertNewlineAt(startIndex)
          startIndex += 1
        position = null
      )
    )
    @ignoreDomChanges = oldIgnoreDomChange

  insertNewlineAt: (startIndex) ->
    [position, startIndex] = Tandem.Utils.Input.normalizePosition(this, startIndex)
    [line, offset] = Tandem.Utils.Node.getChildAtOffset(@iframeDoc.body, startIndex)
    Tandem.Utils.Node.split(line, offset, true)

  insertTextAt: (startIndex, text) ->
    [position, startIndex] = Tandem.Utils.Input.normalizePosition(this, startIndex)
    position.node.textContent = position.node.textContent.substr(0, position.offset) + text + position.node.textContent.substr(position.offset)

  deleteAt: (startIndex, length) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    [startPos, startIndex] = Tandem.Utils.Input.normalizePosition(this, startIndex)
    [endPos, endIndex] = Tandem.Utils.Input.normalizePosition(this, startIndex + length)

    this.preserveSelection(startPos, 0 - length, =>
      fragment = Tandem.Utils.Node.extract(this, startIndex, endIndex)
    )
    @ignoreDomChanges = oldIgnoreDomChange

  getAt: (startIndex, length) ->
    # - Returns array of {text: "", attr: {}}
    # 1. Get all nodes in the range
    # 2. For first and last, change the text
    # 3. Return array
    # - Helper to get nodes in given index range
    # - In the case of 0 lenght, text will always be "", but attributes should be properly applied

  getSelection: ->
    return Tandem.Range.getSelection(this)

  applyAttributeToLine: (line, startOffset, endOffset, attributes) ->
    return if startOffset == endOffset || _.keys(attributes).length == 0
    [startNode, startNodeOffset] = Tandem.Utils.Node.getChildAtOffset(line, startOffset)
    [prevNode, startNode] = Tandem.Utils.Node.split(startNode, startNodeOffset)
    [endNode, endNodeOffset] = Tandem.Utils.Node.getChildAtOffset(line, endOffset)
    [endNode, nextNode] = Tandem.Utils.Node.split(endNode, endNodeOffset)
    fragment = @iframeDoc.createDocumentFragment()
    while startNode?
      nextSibling = startNode.nextSibling
      fragment.appendChild(startNode)
      break if startNode == endNode
      startNode = nextSibling
    for attr, value of attributes
      attrNode = Tandem.Utils.Node.createContainerForAttribute(@iframeDoc, attr)
      attrNode.appendChild(fragment)
      fragment = attrNode
    line.insertBefore(attrNode, nextNode)

 # applyAttribute: (TandemRange range, Object attribute) ->
  # applyAttribute: (Number startIndex, Number length, Object attribute) ->
  applyAttribute: (startIndex, length, attributes, emitEvent = true) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    if !_.isNumber(startIndex)
      [range, attributes] = [startIndex, length]
      startIndex = range.start.getIndex()
      length = range.end.getIndex() - startIndex
    else
      range = new Tandem.Range(this, startIndex, startIndex + length)

    this.preserveSelection(range.start, 0, =>
      for attr, value of attributes
        if value == true
          [startLine, startLineOffset] = Tandem.Utils.Node.getChildAtOffset(@iframeDoc.body, startIndex)
          [endLine, endLineOffset] = Tandem.Utils.Node.getChildAtOffset(@iframeDoc.body, startIndex + length)
          if startLine == endLine
            this.applyAttributeToLine(startLine, startLineOffset, endLineOffset, attributes)
          else
            this.applyAttributeToLine(startLine, startLineOffset, startLine.textContent.length, attributes)
            this.applyAttributeToLine(endLine, 0, endLineOffset, attributes)
            curLine = startLine.nextSibling
            while curLine? && curLine != endLine
              this.applyAttributeToLine(curLine, 0, curLine.textContent.length, attributes)
              curLine = curLine.nextSibling
        else
          range.splitEnds()
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
    @ignoreDomChanges = oldIgnoreDomChange
    
  preserveSelection: (modificationStart, charAdditions, fn) ->
    currentSelection = this.getSelection()
    if currentSelection?
      [selStart, selEnd] = this.transformSelection(modificationStart, currentSelection, charAdditions)
      fn()
      savedSelectionRange = new Tandem.Range(currentSelection.editor, selStart, selEnd)
      rangySel = rangy.getIframeSelection(@iframe)
      range = savedSelectionRange.getRangy()
      rangySel.setSingleRange(range)
    else
      fn()

  transformSelection: (modificationStart, selectionRange, charAdditions) ->
    modPos = modificationStart.getIndex()
    selStart = selectionRange.start.getIndex()
    selEnd = selectionRange.end.getIndex()
    selStart = Math.max(selStart + charAdditions, modPos) if modPos <= selStart
    selEnd = Math.max(selEnd + charAdditions, modPos) if modPos < selEnd
    return [selStart, selEnd]


window.Tandem ||= {}
window.Tandem.Editor = TandemEditor
