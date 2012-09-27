#= require underscore
#= require rangy/rangy-core
#= require diff_match_patch
#= require eventemitter2
#= require jetsync
#= require tandem/document
#= require tandem/range

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
    @doc = new Tandem.Document(this, @iframe.contentWindow.document.body)
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
        line-height: 15px;
        margin: 0px; 
        padding: 10px; 
      }
      
      a { text-decoration: underline; }
      b { font-weight: bold; }
      i { font-style: italic; }
      s { text-decoration: line-through; }
      u { text-decoration: underline; }

      ol, ul { margin: 0px; padding: 0px; }
      ul { list-style-type: disc; }

      ol.indent-1, ol.indent-4, ol.indent-7 { list-style-type: decimal; }
      ol.indent-2, ol.indent-5, ol.indent-8 { list-style-type: lower-alpha; }
      ol.indent-3, ol.indent-6, ol.indent-9 { list-style-type: lower-roman; }

      .font-background.black  { background-color: black; }
      .font-background.red    { background-color: red; }
      .font-background.orange { background-color: orange; }
      .font-background.yellow { background-color: yellow; }
      .font-background.green  { background-color: green; }
      .font-background.blue   { background-color: blue; }
      .font-background.purple { background-color: purple; }
      .font-color.white       { color: white; }
      .font-color.red         { color: red; }
      .font-color.orange      { color: orange; }
      .font-color.yellow      { color: yellow; }
      .font-color.green       { color: green; }
      .font-color.blue        { color: blue; }
      .font-color.purple      { color: purple; }
      .font-family.monospace  { font-family: 'Courier New', monospace; }
      .font-family.serif      { font-family: 'Times New Roman', serif; }
      .font-size.huge         { font-size: 32px; line-height: 36px; }
      .font-size.large        { font-size: 18px; line-height: 22px; }
      .font-size.small        { font-size: 10px; line-height: 12px; }

      .indent-1 { margin-left: 3em; }
      .indent-2 { margin-left: 5em; }
      .indent-3 { margin-left: 7em; }
      .indent-4 { margin-left: 9em; }
      .indent-5 { margin-left: 11em; }
      .indent-6 { margin-left: 13em; }
      .indent-7 { margin-left: 15em; }
      .indent-8 { margin-left: 17em; }
      .indent-9 { margin-left: 19em; }
      
      .tab { display: inline-block; width: 2em; }
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
    onEdit = _.debounce( =>
      delta = this.update()
      this.emit(this.events.USER_TEXT_CHANGE, delta) if !delta.isIdentity()
    , 100)

    @doc.root.addEventListener('DOMSubtreeModified', =>
      return if @ignoreDomChanges
      onEdit()
    )

  initSelectionListeners: ->
    checkSelectionChange = =>
      return if @ignoreDomChanges
      selection = this.getSelection()
      if selection != @currentSelection && ((selection? && !selection.equals(@currentSelection)) || !@currentSelection.equals(selection))
        this.emit(this.events.USER_SELECTION_CHANGE, selection)
        @currentSelection = selection

    @doc.root.addEventListener('keyup', _.debounce(checkSelectionChange, 100))
    @doc.root.addEventListener('mouseup', _.debounce(checkSelectionChange, 100))
    setInterval(checkSelectionChange, this.options.POLL_INTERVAL)


  # applyAttribute: (TandemRange range, String attr, Mixed value) ->
  # applyAttribute: (Number startIndex, Number length, String attr, Mixed value) ->
  applyAttribute: (startIndex, length, attr, value, emitEvent = true) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    if !_.isNumber(startIndex)
      [range, attr, value] = [startIndex, length, attr]
      startIndex = range.start.getIndex()
      length = range.end.getIndex() - startIndex
    else
      range = new Tandem.Range(this, startIndex, startIndex + length)

    this.preserveSelection(range.start, 0, =>
      [startLine, startLineOffset] = Tandem.Utils.getChildAtOffset(@doc.root, startIndex)
      [endLine, endLineOffset] = Tandem.Utils.getChildAtOffset(@doc.root, startIndex + length)
      if startLine == endLine
        this.applyAttributeToLine(startLine, startLineOffset, endLineOffset, attr, value)
      else
        this.applyAttributeToLine(startLine, startLineOffset, startLine.textContent.length, attr, value)
        this.applyAttributeToLine(endLine, 0, endLineOffset, attr, value)
        curLine = startLine.nextSibling
        while curLine? && curLine != endLine
          this.applyAttributeToLine(curLine, 0, curLine.textContent.length, attr, value)
          curLine = curLine.nextSibling
      @doc.rebuildDirty()
    )
    if emitEvent
      deltas = []
      deltas.push(new JetRetain(0, startIndex)) if startIndex > 0
      attribute = {}
      attribute[attr] = value
      deltas.push(new JetRetain(startIndex, startIndex + length, attribute))
      deltas.push(new JetRetain(startIndex + length, @doc.length)) if startIndex + length < @doc.length
      delta = new JetDelta(@doc.length, @doc.length, deltas)
      this.emit(this.events.API_TEXT_CHANGE, delta)
    @ignoreDomChanges = oldIgnoreDomChange

  applyAttributeToLine: (lineNode, startOffset, endOffset, attr, value) ->
    console.log lineNode, startOffset, endOffset, attr, value
    return if startOffset == endOffset
    line = @doc.findLine(lineNode)
    if _.indexOf(Tandem.Constants.LINE_ATTRIBUTES, attr, true) > -1
      this.applyLineAttribute(line, attr, value)
    else
      [prevNode, startNode] = line.splitContents(startOffset)
      [endNode, nextNode] = line.splitContents(endOffset)
      if value && Tandem.Utils.getAttributeDefault(attr) != value
        fragment = @doc.root.ownerDocument.createDocumentFragment()
        Tandem.Utils.traverseSiblings(startNode, endNode, (node) ->
          fragment.appendChild(node)
        )
        attrNode = Tandem.Utils.createContainerForAttribute(@doc.root.ownerDocument, attr, value)
        attrNode.appendChild(fragment)
        lineNode.insertBefore(attrNode, nextNode)
      else
        Tandem.Utils.traverseSiblings(startNode, endNode, (node) ->
          Tandem.Utils.removeAttributeFromSubtree(node, attr)
        )
    @doc.updateLine(line)

  applyDelta: (delta) ->
    console.assert(delta.startLength == @doc.length, "Trying to apply delta to incorrect doc length", delta, @doc, @doc.root)
    index = 0       # Stores where the last retain end was, so if we see another one, we know to delete
    offset = 0      # Tracks how many characters inserted to correctly offset new text
    _.each(delta.deltas, (delta) =>
      if JetDelta.isInsert(delta)
        this.insertAt(index + offset, delta.text, false)
        _.each(delta.attributes, (value, attr) =>
          this.applyAttribute(index + offset, delta.text.length, attr, value, false)
        )
        offset += delta.getLength()
      else if JetDelta.isRetain(delta)
        if delta.start > index
          this.deleteAt(index + offset, delta.start - index, false)
          offset -= (delta.start - index)
        else
          _.each(delta.attributes, (value, attr) =>
            if delta.end - delta.start > 0
              this.applyAttribute(index + offset, delta.end - delta.start, attr, value, false)
          )
        index = delta.end
      else
        console.warn('Unrecognized type in delta', delta)
    )
    # If end of text was deleted
    if delta.endLength < delta.startLength + offset
      this.deleteAt(delta.endLength, delta.startLength + offset - delta.endLength, false)

  applyLineAttribute: (line, attr, value) ->
    # Handle:
      # 1. Removal of bulleted items
      # 2. Adding alignment
      # 3. Removing alignment
      # 4. Adding indent
      # 5. Removing indent
    if _.indexOf(Tandem.Constants.LIST_ATTRIBUTES, attr, true) > -1
      tagName = if attr == 'list' then 'ol' else 'ul'
      lineNode = line.node
      ol = lineNode.ownerDocument.createElement(tagName)
      line.node = Tandem.Utils.wrap(ol, lineNode)
      Tandem.Utils.switchTag(lineNode, 'LI')
      line.node.className = lineNode.className
      line.node.id = lineNode.id

  deleteAt: (startIndex, length, emitEvent = true) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    originalDocLength = @doc.length
    startPos = Tandem.Position.makePosition(this, startIndex)
    startIndex = startPos.getIndex()
    endPos = Tandem.Position.makePosition(this, startIndex + length)
    endIndex = endPos.getIndex()
    this.preserveSelection(startPos, 0 - length, =>
      [startLineNode, startOffset] = Tandem.Utils.getChildAtOffset(@doc.root, startIndex)
      [endLineNode, endOffset] = Tandem.Utils.getChildAtOffset(@doc.root, endIndex)
      fragment = Tandem.Utils.extractNodes(startLineNode, startOffset, endLineNode, endOffset)
      lineNodes = _.values(fragment.childNodes).concat(_.uniq([startLineNode, endLineNode]))
      _.each(lineNodes, (lineNode) =>
        line = @doc.findLine(lineNode)
        @doc.updateLine(line) if line?
      )
    )
    if emitEvent
      deltas = []
      deltas.push(new JetRetain(0, startIndex)) if 0 < startIndex
      deltas.push(new JetRetain(startIndex + length, originalDocLength)) if startIndex + length < originalDocLength
      delta = new JetDelta(originalDocLength, @doc.length, deltas)
      this.emit(this.events.API_TEXT_CHANGE, delta)
    @ignoreDomChanges = oldIgnoreDomChange

  getAt: (startIndex, length) ->
    # - Returns array of {text: "", attr: {}}
    # 1. Get all nodes in the range
    # 2. For first and last, change the text
    # 3. Return array
    # - Helper to get nodes in given index range
    # - In the case of 0 lenght, text will always be "", but attributes should be properly applied

  getDelta: ->
    return @doc.toDelta()

  getSelection: ->
    return Tandem.Range.getSelection(this)

  insertAt: (startIndex, text, emitEvent = true) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    originalDocLength = @doc.length
    position = Tandem.Position.makePosition(this, startIndex)
    startIndex = position.getIndex()

    this.preserveSelection(position, text.length, =>
      lines = text.split("\n")
      index = startIndex
      _.each(lines, (line, lineIndex) =>
        position = new Tandem.Position(this, index) unless position?
        this.insertTextAt(position, line)
        index += line.length
        if lineIndex < lines.length - 1
          this.insertNewlineAt(index)
          index += 1
        position = null
      )
    )
    if emitEvent
      deltas = []
      deltas.push(new JetRetain(0, startIndex)) if 0 < startIndex
      deltas.push(new JetInsert(text))
      deltas.push(new JetRetain(startIndex, originalDocLength)) if startIndex < originalDocLength
      delta = new JetDelta(originalDocLength, @doc.length, deltas)
      this.emit(this.events.API_TEXT_CHANGE, delta)
    @ignoreDomChanges = oldIgnoreDomChange

  insertNewlineAt: (startIndex) ->
    [line, offset] = @doc.findLineAtOffset(startIndex)
    @doc.splitLine(line, offset)

  # insertTextAt: (Number startIndex, String text) ->
  # insertTextAt: (TandemRange startIndex, String text) ->
  insertTextAt: (startIndex, text) ->
    position = Tandem.Position.makePosition(this, startIndex)
    startIndex = position.getIndex()
    leaf = position.getLeaf()
    if _.keys(leaf.attributes).length > 0
      [lineNode, lineOffset] = Tandem.Utils.getChildAtOffset(@doc.root, startIndex)
      line = @doc.findLine(lineNode)
      [beforeNode, afterNode] = line.splitContents(lineOffset)
      span = lineNode.ownerDocument.createElement('span')
      span.textContent = text
      lineNode.insertBefore(span, afterNode)
    else
      if leaf.node.nodeName == 'BR'
        parent = leaf.node.parentNode
        parent.removeChild(leaf.node)
        leaf.node = parent.ownerDocument.createElement('span')
        leaf.setText(text)
        parent.appendChild(leaf.node)
      else
        leaf.setText(leaf.node.textContent.substr(0, position.offset) + text + leaf.node.textContent.substr(position.offset))
    @doc.updateLine(leaf.line)

  preserveSelection: (modificationStart, charAdditions, fn) ->
    @currentSelection = this.getSelection()
    if @currentSelection?
      [selStart, selEnd] = this.transformSelection(modificationStart, @currentSelection, charAdditions)
      fn()
      savedSelectionRange = new Tandem.Range(@currentSelection.editor, selStart, selEnd)
      rangySel = rangy.getSelection(@iframe.contentWindow)
      range = savedSelectionRange.getRangy()
      rangySel.setSingleRange(range)
    else
      fn()

  transformSelection: (modificationStart, selectionRange, charAdditions) ->
    modPos = if modificationStart? then modificationStart.getIndex() else 0
    selStart = selectionRange.start.getIndex()
    selEnd = selectionRange.end.getIndex()
    selStart = Math.max(selStart + charAdditions, modPos) if modPos <= selStart
    selEnd = Math.max(selEnd + charAdditions, modPos) if modPos < selEnd
    return [selStart, selEnd]

  update: ->
    oldDelta = @doc.toDelta()
    this.preserveSelection(null, 0, =>
      # TODO this is incorrect, we need to search for dirty lines and mark them, normalize only operates on dirty lines
      Tandem.Document.normalizeHtml(@doc.root)
      lines = @doc.lines.toArray()
      lineNode = @doc.root.firstChild
      _.each(lines, (line, index) =>
        while line.node != lineNode
          if line.node.parentNode == @doc.root
            newLine = @doc.insertLineBefore(lineNode, line)
            lineNode = lineNode.nextSibling
          else
            @doc.removeLine(line)
            return
        if line.innerHTML != lineNode.innerHTML
          @doc.updateLine(line)
        lineNode = lineNode.nextSibling
      )
      while lineNode != null
        newLine = @doc.appendLine(lineNode)
        lineNode = lineNode.nextSibling
    )
    newDelta = @doc.toDelta()
    decompose = JetSync.decompose(oldDelta, newDelta)
    compose = JetSync.compose(oldDelta, decompose)
    if !_.isEqual(compose, newDelta)
      console.info(JSON.stringify(oldDelta))
      console.info(JSON.stringify(newDelta))
      console.info(JSON.stringify(decompose))
      console.info(JSON.stringify(compose))
      console.assert(false, oldDelta, newDelta, decompose, compose)
    return JetSync.decompose(oldDelta, newDelta)


window.Tandem ||= {}
window.Tandem.Editor = TandemEditor
