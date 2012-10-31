#= require underscore
#= require rangy/rangy-core
#= require diff_match_patch
#= require eventemitter2
#= require tandem/document
#= require tandem/range
#= require tandem/keyboard
#= require tandem/selection
#= require tandem/renderer

class TandemEditor extends EventEmitter2
  @editors: []

  @CONTAINER_ID: 'tandem-container'
  @ID_PREFIX: 'editor-'
  @DEFAULTS:
    cursor: 0
    enabled: true
    styles: {}

  @events: 
    API_TEXT_CHANGE       : 'api-text-change'
    USER_SELECTION_CHANGE : 'user-selection-change'
    USER_TEXT_CHANGE      : 'user-text-change'

  constructor: (@iframeContainer, options) ->
    @options = _.extend(Tandem.Editor.DEFAULTS, options)
    @id = _.uniqueId(TandemEditor.ID_PREFIX)
    @iframeContainer = document.getElementById(@iframeContainer) if _.isString(@iframeContainer)
    @destructors = []
    this.reset(true)
    this.enable() if @options.enabled

  destroy: ->
    this.disable()
    @renderer.destroy()
    @selection.destroy()
    _.each(@destructors, (fn) =>
      fn.call(this)
    )
    @destructors = null

  reset: (keepHTML = false) ->
    @ignoreDomChanges = true
    options = _.clone(@options)
    options.keepHTML = keepHTML
    @renderer = new Tandem.Renderer(@iframeContainer, options)
    @contentWindow = @renderer.iframe.contentWindow
    @doc = new Tandem.Document(this, @contentWindow.document.getElementById(TandemEditor.CONTAINER_ID))
    @selection = new Tandem.Selection(this)
    @keyboard = new Tandem.Keyboard(this)
    this.initListeners()
    @ignoreDomChanges = false
    TandemEditor.editors.push(this)

  disable: ->
    this.trackDelta( =>
      @doc.root.setAttribute('contenteditable', false)
    , false)

  enable: ->
    if !@doc.root.getAttribute('contenteditable')
      this.trackDelta( =>
        @doc.root.setAttribute('contenteditable', true)
      , false)
      @doc.root.focus()
      position = Tandem.Position.makePosition(this, @options.cursor)
      start = new Tandem.Range(this, position, position)
      this.setSelection(start)

  initListeners: ->
    deboundedEdit = _.debounce( =>
      return if @ignoreDomChanges or !@destructors?
      delta = this.update()
      this.emit(TandemEditor.events.USER_TEXT_CHANGE, delta) if !delta.isIdentity()
    , 100)
    onEdit = =>
      return if @ignoreDomChanges or !@destructors?
      deboundedEdit()
    @doc.root.addEventListener('DOMSubtreeModified', onEdit)
    @destructors.push( ->
      @doc.root.removeEventListener('DOMSubtreeModified', onEdit)
    )

  # applyAttribute: (TandemRange range, String attr, Mixed value) ->
  # applyAttribute: (Number startIndex, Number length, String attr, Mixed value) ->
  applyAttribute: (startIndex, length, attr, value, emitEvent = true) ->
    delta = this.trackDelta( =>
      range = new Tandem.Range(this, startIndex, startIndex + length)
      @selection.preserve( =>
        [startLine, startLineOffset] = @doc.findLineAtOffset(startIndex)
        [endLine, endLineOffset] = @doc.findLineAtOffset(startIndex + length)
        if startLine == endLine
          this.applyAttributeToLine(startLine, startLineOffset, endLineOffset, attr, value)
        else
          curLine = startLine.next
          while curLine? && curLine != endLine
            next = curLine.next
            this.applyAttributeToLine(curLine, 0, curLine.length, attr, value)
            curLine = next
          this.applyAttributeToLine(startLine, startLineOffset, startLine.length, attr, value)
          this.applyAttributeToLine(endLine, 0, endLineOffset, attr, value) if endLine?
        @doc.rebuildDirty()
      )
    , emitEvent)
    this.emit(TandemEditor.events.API_TEXT_CHANGE, delta) if emitEvent

  applyAttributeToLine: (line, startOffset, endOffset, attr, value) ->
    if _.indexOf(Tandem.Constants.LINE_ATTRIBUTES, attr, true) > -1
      if startOffset == 0 && endOffset >= line.length
        this.applyLineAttribute(line, attr, value)
    else
      [prevNode, startNode] = line.splitContents(startOffset)
      [endNode, nextNode] = line.splitContents(endOffset)
      parentNode = startNode?.parentNode || prevNode?.parentNode
      if value && Tandem.Utils.getAttributeDefault(attr) != value
        fragment = @doc.root.ownerDocument.createDocumentFragment()
        Tandem.Utils.traverseSiblings(startNode, endNode, (node) ->
          node = Tandem.Utils.removeAttributeFromSubtree(node, attr)
          fragment.appendChild(node)
        )
        attrNode = Tandem.Utils.createContainerForAttribute(@doc.root.ownerDocument, attr, value)
        attrNode.appendChild(fragment)
        if nextNode? && (parentNode.compareDocumentPosition(nextNode) & parentNode.DOCUMENT_POSITION_CONTAINED_BY) == parentNode.DOCUMENT_POSITION_CONTAINED_BY
          parentNode.insertBefore(attrNode, nextNode)
        else
          parentNode.appendChild(attrNode)
      else
        Tandem.Utils.traverseSiblings(startNode, endNode, (node) ->
          Tandem.Utils.removeAttributeFromSubtree(node, attr)
        )
    @doc.updateLine(line)
    Tandem.Document.fixListNumbering(@doc.root) if attr == 'list'

  applyDelta: (delta) ->
    console.assert(delta.startLength == @doc.length, "Trying to apply delta to incorrect doc length", delta, @doc, @doc.root)
    index = 0       # Stores where the last retain end was, so if we see another one, we know to delete
    offset = 0      # Tracks how many characters inserted to correctly offset new text
    oldDelta = @doc.toDelta()
    retains = []
    _.each(delta.deltas, (delta) =>
      if JetDelta.isInsert(delta)
        this.insertAt(index + offset, delta.text, false)
        retains.push(new JetRetain(index + offset, index + offset + delta.text.length, delta.attributes))
        offset += delta.getLength()
      else if JetDelta.isRetain(delta)
        if delta.start > index
          this.deleteAt(index + offset, delta.start - index, false)
          offset -= (delta.start - index)
        retains.push(new JetRetain(delta.start + offset, delta.end + offset, delta.attributes))
        index = delta.end
      else
        console.warn('Unrecognized type in delta', delta)
    )
    # If end of text was deleted
    if delta.endLength < delta.startLength + offset
      this.deleteAt(delta.endLength, delta.startLength + offset - delta.endLength, false)

    retainDelta = new JetDelta(delta.endLength, delta.endLength, retains)
    retainDelta.compact()
    _.each(retainDelta.deltas, (delta) =>
      _.each(delta.attributes, (value, attr) =>
        this.applyAttribute(delta.start, delta.end - delta.start, attr, value, false) if value == null
      )
      _.each(delta.attributes, (value, attr) =>
        this.applyAttribute(delta.start, delta.end - delta.start, attr, value, false) if value?
      )
    )

    newDelta = @doc.toDelta()
    composed = JetSync.compose(oldDelta, delta)
    composed.compact()
    console.assert(_.isEqual(composed, newDelta), oldDelta, delta, composed, newDelta)

  applyLineAttribute: (line, attr, value) ->
    indent = if _.isNumber(value) then value else (if value then 1 else 0)
    if attr == 'indent'
      Tandem.Utils.setIndent(line.node, indent)
    else if Tandem.Constants.INDENT_ATTRIBUTES[attr]?
      lineNode = line.node
      expectedTag = if value then (if attr == 'list' then 'OL' else 'UL') else 'DIV'
      if lineNode.tagName != expectedTag
        if value && lineNode.firstChild.tagName != 'LI'
          li = lineNode.ownerDocument.createElement('li')
          Tandem.Utils.wrapChildren(li, lineNode)
        else if !value && lineNode.firstChild.tagName == 'LI'
          Tandem.Utils.unwrap(lineNode.firstChild)
        line.node = Tandem.Utils.switchTag(lineNode, expectedTag)
      Tandem.Utils.setIndent(line.node, indent)
    line.setDirty()

  deleteAt: (index, length, emitEvent = true) ->
    delta = this.trackDelta( =>
      startPos = Tandem.Position.makePosition(this, index)
      endPos = Tandem.Position.makePosition(this, index + length)
      @selection.preserve( =>
        [startLineNode, startOffset] = Tandem.Utils.getChildAtOffset(@doc.root, index)
        [endLineNode, endOffset] = Tandem.Utils.getChildAtOffset(@doc.root, index + length)
        fragment = Tandem.Utils.extractNodes(startLineNode, startOffset, endLineNode, endOffset)
        lineNodes = _.values(fragment.childNodes).concat(_.uniq([startLineNode, endLineNode]))
        _.each(lineNodes, (lineNode) =>
          line = @doc.findLine(lineNode)
          @doc.updateLine(line) if line?
        )
        @doc.rebuildDirty()
      )
    , emitEvent)
    this.emit(TandemEditor.events.API_TEXT_CHANGE, delta) if emitEvent

  getAt: (index, length) ->
    # - Returns array of {text: "", attr: {}}
    # 1. Get all nodes in the range
    # 2. For first and last, change the text
    # 3. Return array
    # - Helper to get nodes in given index range
    # - In the case of 0 lenght, text will always be "", but attributes should be properly applied

  getDelta: ->
    return @doc.toDelta()

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text, emitEvent = true) ->
    delta = this.trackDelta( =>
      position = Tandem.Position.makePosition(this, index)
      startLine = @doc.findLineAtOffset(index)
      [line, lineOffset] = @doc.findLineAtOffset(index)
      @selection.preserve( =>
        textLines = text.split("\n")
        if textLines.length == 1
          contents = this.makeLineContents(text)
          this.insertContentsAt(line, lineOffset, contents)
        else
          [line1, line2] = this.insertNewlineAt(line, lineOffset)
          contents = this.makeLineContents(textLines[0])
          this.insertContentsAt(line1, lineOffset, contents)
          contents = this.makeLineContents(textLines[textLines.length - 1])
          this.insertContentsAt(line2, 0, contents)
          if textLines.length > 2
            _.each(textLines.slice(1, -1), (lineText) =>
              lineNode = this.makeLine(lineText)
              @doc.root.insertBefore(lineNode, line2.node)
              @doc.insertLineBefore(lineNode, line2)
            )
        # TODO could be more clever about if we need to call this
        Tandem.Document.fixListNumbering(@doc.root) if textLines.length > 1
        @doc.rebuildDirty()
      )
    , emitEvent)
    this.emit(TandemEditor.events.API_TEXT_CHANGE, delta) if emitEvent

  makeLine: (text) ->
    lineNode = @doc.root.ownerDocument.createElement('div')
    lineNode.classList.add(Tandem.Line.CLASS_NAME)
    contents = this.makeLineContents(text)
    _.each(contents, (content) ->
      lineNode.appendChild(content)
    )
    return lineNode

  makeLineContents: (text) ->
    strings = text.split("\t")
    contents = []
    _.each(strings, (str, strIndex) =>
      contents.push(this.makeText(str)) if str.length > 0
      if strIndex < strings.length - 1
        contents.push(this.makeTab())
    )
    return contents

  makeTab: ->
    tab = @doc.root.ownerDocument.createElement('span')
    tab.classList.add(Tandem.Leaf.TAB_NODE_CLASS)
    tab.classList.add(Tandem.Constants.SPECIAL_CLASSES.ATOMIC)
    tab.textContent = "\t"
    return tab

  makeText: (text) ->
    node = @doc.root.ownerDocument.createElement('span')
    node.textContent = text
    return node

  # insertContentsAt: (Number startIndex, String text) ->
  # insertContentsAt: (TandemRange startIndex, String text) ->
  insertContentsAt: (line, offset, contents) ->
    return if contents.length == 0
    [leaf, leafOffset] = line.findLeafAtOffset(offset)
    if leaf.node.nodeName != 'BR'
      [beforeNode, afterNode] = line.splitContents(offset)
      parentNode = beforeNode?.parentNode || afterNode?.parentNode
      _.each(contents, (content) ->
        parentNode.insertBefore(content, afterNode)
      )
    else
      parentNode = leaf.node.parentNode
      parentNode.removeChild(leaf.node)
      _.each(contents, (content) ->
        parentNode.appendChild(content)
      )
    @doc.updateLine(line)

  insertNewlineAt: (line, offset) ->
    if offset == 0 or offset == line.length
      div = @doc.root.ownerDocument.createElement('div')
      if offset == 0
        @doc.root.insertBefore(div, line.node)
        newLine = @doc.insertLineBefore(div, line)
        return [newLine, line]
      else
        refLine = line.next
        refLineNode = if refLine? then refLine.node else null
        @doc.root.insertBefore(div, refLineNode)
        newLine = @doc.insertLineBefore(div, refLine)
        return [line, newLine]
    else
      newLine = @doc.splitLine(line, offset)
      return [line, newLine]

  setSelection: (range) ->
    @selection.setRange(range)

  trackDelta: (fn, track = true) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    delta = null
    if track
      oldDelta = @doc.toDelta()
      fn()
      newDelta = @doc.toDelta()
      decompose = JetSync.decompose(oldDelta, newDelta)
      compose = JetSync.compose(oldDelta, decompose)
      console.assert(_.isEqual(compose, newDelta), oldDelta, newDelta, decompose, compose)
      delta = decompose
    else
      fn()
    @ignoreDomChanges = oldIgnoreDomChange
    return delta

  update: ->
    delta = this.trackDelta( =>
      @selection.preserve( =>
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
          @doc.updateLine(line)
          lineNode = lineNode.nextSibling
        )
        while lineNode != null
          newLine = @doc.appendLine(lineNode)
          lineNode = lineNode.nextSibling
      )
    , true)
    return delta



window.Tandem ||= {}
window.Tandem.Editor = TandemEditor
