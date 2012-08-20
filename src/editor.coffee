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
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex) else startIndex
    this.preserveSelection(range.start, text.length, =>
      lines = text.split("\n")
      _.each(lines, (line, lineIndex) =>
        range = new Tandem.Range(this, startIndex, startIndex) unless range?
        range.start.node.textContent = range.start.node.textContent.substr(0, range.start.offset) + line + range.start.node.textContent.substr(range.start.offset)
        startIndex += line.length
        this.insertNewlineAt(startIndex) if lineIndex < lines.length - 1
        startIndex += 1
        range = null
      )
    )
    @ignoreDomChanges = oldIgnoreDomChange

  insertNewlineAt: (startIndex) ->
    range = new Tandem.Range(this, startIndex, startIndex)
    range.splitAfter()
    div = Tandem.Utils.Node.cloneNodeWithAncestors(@iframeDoc, range.start.node)
    @iframeDoc.body.insertBefore(div, Tandem.Utils.Node.getLine(range.end.node).nextSibling)
    node = range.end.node.nextSibling
    while node?
      nextSibling = node.nextSibling
      div.appendChild(node)
      node = nextSibling

  deleteAt: (startIndex, length) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    range = if _.isNumber(startIndex) then new Tandem.Range(this, startIndex, startIndex + length) else startIndex
    this.preserveSelection(range.start, 0 - length, =>
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
      for attr,value of attributes
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
