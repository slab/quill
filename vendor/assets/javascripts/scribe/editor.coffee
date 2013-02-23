doAt = (fn) ->
  doSilently.call(this, =>
    @selection.preserve( =>
      return trackDelta.call(this, =>
        keepNormalized.call(this, =>
          fn.call(this)
        )
      )
    )
  )

doSilently = (fn) ->
  oldIgnoreDomChange = @ignoreDomChanges
  @ignoreDomChanges = true
  fn()
  @ignoreDomChanges = oldIgnoreDomChange

initListeners = ->
  onEditOnce = =>
  onEdit = =>
    onEditOnce = _.once(onEdit)
    return if @ignoreDomChanges
    update.call(this)
  onSubtreeModified = =>
    return if @ignoreDomChanges
    toCall = onEditOnce
    _.defer( =>
      toCall.call(null)
    )
  onEditOnce = _.once(onEdit)
  @root.addEventListener('DOMSubtreeModified', onSubtreeModified)

keepNormalized = (fn) ->
  fn.call(this)
  @doc.rebuildDirty()

trackDelta = (fn) ->
  oldDelta = @doc.toDelta()
  fn()
  newDelta = @doc.toDelta()
  decompose = newDelta.decompose(oldDelta)
  compose = oldDelta.compose(decompose)
  console.assert(compose.isEqual(newDelta), oldDelta, newDelta, decompose, compose)
  this.emit(ScribeEditor.events.TEXT_CHANGE, decompose) unless decompose.isIdentity()
  return decompose

update = ->
  doSilently.call(this, =>
    @selection.preserve( =>
      return trackDelta.call(this, =>
        Scribe.Document.normalizeHtml(@root)
        lines = @doc.lines.toArray()
        lineNode = @root.firstChild
        _.each(lines, (line, index) =>
          while line.node != lineNode
            if line.node.parentNode == @root
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
    )
  )


class ScribeEditor extends EventEmitter2
  @editors: []

  @CONTAINER_ID: 'scribe-container'
  @ID_PREFIX: 'editor-'
  @CURSOR_PREFIX: 'cursor-'
  @DEFAULTS:
    cursor: 0
    enabled: true
    styles: {}
  @events: 
    TEXT_CHANGE      : 'text-change'
    SELECTION_CHANGE : 'selection-change'

  constructor: (@iframeContainer, options) ->
    @options = _.extend(Scribe.Editor.DEFAULTS, options)
    @id = _.uniqueId(ScribeEditor.ID_PREFIX)
    @iframeContainer = document.getElementById(@iframeContainer) if _.isString(@iframeContainer)
    this.reset(true)
    this.enable() if @options.enabled

  disable: ->
    doSilently.call(this, =>
      @root.setAttribute('contenteditable', false)
    )

  enable: ->
    if !@root.getAttribute('contenteditable')
      doSilently.call(this, =>
        @root.setAttribute('contenteditable', true)
      )

  reset: (keepHTML = false) ->
    @ignoreDomChanges = true
    options = _.clone(@options)
    options.keepHTML = keepHTML
    @renderer = new Scribe.Renderer(@iframeContainer, options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @contentWindow.document.getElementById(ScribeEditor.CONTAINER_ID)
    @doc = new Scribe.Document(@root)
    @selection = new Scribe.Selection(this)
    @keyboard = new Scribe.Keyboard(this)
    @undoManager = new Scribe.UndoManager(this)
    @pasteManager = new Scribe.PasteManager(this)
    initListeners.call(this)
    @ignoreDomChanges = false
    ScribeEditor.editors.push(this)

  applyDelta: (delta, external = true) ->
    # Make exception for systems that assume editors start with empty text
    if delta.startLength == 0 and this.getLength() == 1
      return this.setDelta(delta)
    return if delta.isIdentity()
    doSilently.call(this, =>
      @selection.preserve( =>
        console.assert(delta.startLength == this.getLength(), "Trying to apply delta to incorrect doc length", delta, @doc, @root)
        oldDelta = @doc.toDelta()
        delta.apply((index, text, formatting) =>
          this.insertAt.call(this, index, text, formatting)
        , (index, length) =>
          this.deleteAt.call(this, index, length)
        , @doc.formatText, @doc)
        unless external
          this.emit(ScribeEditor.events.TEXT_CHANGE, delta)
        # TODO enable when we figure out addNewline issue, currently will fail if we do add newline
        #console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
      )
    )

  deleteAt: (index, length) ->
    doAt.call(this, =>
      if index + length >= this.getLength()
        length = this.getLength() - index - 1
        # TODO fix this in the case of being called from applyDelta
        addNewlineDelta = new Tandem.Delta(this.getLength(), [
          new Tandem.RetainOp(0, this.getLength())
          new Tandem.InsertOp("\n")
        ])
        #this.emit(ScribeEditor.events.TEXT_CHANGE, addNewlineDelta)
      return if length <= 0
      [anchorLine, offset] = @doc.findLineAtOffset(index)
      deleteLength = Math.min(length, anchorLine.length - offset)
      anchorLine.deleteText(offset, deleteLength)
      length -= deleteLength
      if length > 0
        line = anchorLine.next
        length -= 1   # newline will be removed by mergeLines later
        while length > 0 and length > line.length
          length -= (line.length + 1)
          nextLine = line.next
          Scribe.Utils.removeNode(line.node)
          @doc.removeLine(line)
          line = nextLine
        line.deleteText(0, length)
        @doc.mergeLines(anchorLine, line)
    )


  # formatAt: (Number index, Number length, String name, Mixed value) ->
  formatAt: (index, length, name, value) ->
    doAt.call(this, =>
      @doc.formatText(index, length, name, value)
    )

  getDelta: ->
    return @doc.toDelta()

  getLength: ->
    return @doc.toDelta().endLength

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text, formatting = {}) ->
    doAt.call(this, =>
      text = text.replace(/\r\n/g, '\n')
      text = text.replace(/\r/g, '\n')
      lineTexts = text.split('\n')
      if index == this.getLength()
        if lineTexts[lineTexts.length - 1] == ''
          lineTexts.pop()
        else if false
          # TODO fix this in the case of being called from applyDelta
          addNewlineDelta = new Tandem.Delta(this.getLength(), [
            new Tandem.RetainOp(0, this.getLength())
            new Tandem.InsertOp("\n")
          ])
          #this.emit(ScribeEditor.events.TEXT_CHANGE, addNewlineDelta)
        line = @doc.splitLine(@doc.lines.last, @doc.lines.last.length)
        offset = 0
      else
        [line, offset] = @doc.findLineAtOffset(index)
      _.each(lineTexts, (lineText, i) =>
        line.insertText(offset, lineText, formatting)
        if i < lineTexts.length - 1
          line = @doc.splitLine(line, offset + lineText.length)
        offset = 0
      )
    )

  setDelta: (delta) ->
    oldLength = delta.startLength
    delta.startLength = this.getLength()
    this.applyDelta(delta)
    delta.startLength = oldLength
    
  setSelection: (range) ->
    @selection.setRange(range)



window.Scribe ||= {}
window.Scribe.Editor = ScribeEditor
