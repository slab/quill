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
    this.initListeners()
    @ignoreDomChanges = false
    ScribeEditor.editors.push(this)

  disable: ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', false)
    )

  enable: ->
    if !@root.getAttribute('contenteditable')
      this.doSilently( =>
        @root.setAttribute('contenteditable', true)
      )

  initListeners: ->
    onEditOnce = =>
    onEdit = =>
      onEditOnce = _.once(onEdit)
      return if @ignoreDomChanges
      this.update()
    onSubtreeModified = =>
      return if @ignoreDomChanges
      toCall = onEditOnce
      _.defer( =>
        toCall.call(null)
      )
    onEditOnce = _.once(onEdit)
    @root.addEventListener('DOMSubtreeModified', onSubtreeModified)

  keepNormalized: (fn) ->
    fn.call(this)
    @doc.rebuildDirty()
    @doc.forceTrailingNewline()

  applyDelta: (delta, external = true) ->
    return if delta.isIdentity()
    this.doSilently( =>
      @selection.preserve( =>
        console.assert(delta.startLength == @doc.length, "Trying to apply delta to incorrect doc length", delta, @doc, @root)
        index = 0       # Stores where the last retain end was, so if we see another one, we know to delete
        offset = 0      # Tracks how many characters inserted to correctly offset new text
        oldDelta = @doc.toDelta()
        retains = []
        _.each(delta.ops, (op) =>
          if Tandem.Delta.isInsert(op)
            @doc.insertText(index + offset, op.value)
            retains.push(new Tandem.RetainOp(index + offset, index + offset + op.getLength(), op.attributes))
            offset += op.getLength()
          else if Tandem.Delta.isRetain(op)
            if op.start > index
              @doc.deleteText(index + offset, op.start - index)
              offset -= (op.start - index)
            retains.push(new Tandem.RetainOp(op.start + offset, op.end + offset, op.attributes))
            index = op.end
          else
            console.warn('Unrecognized type in delta', op)
        )
        # If end of text was deleted
        if delta.endLength < delta.startLength + offset
          @doc.deleteText(delta.endLength, delta.startLength + offset - delta.endLength)
        retainDelta = new Tandem.Delta(delta.endLength, delta.endLength, retains)
        _.each(retainDelta.ops, (op) =>
          _.each(op.attributes, (value, format) =>
            @doc.formatText(op.start, op.end - op.start, format, value) if value == null
          )
          _.each(op.attributes, (value, format) =>
            @doc.formatText(op.start, op.end - op.start, format, value) if value?
          )
        )
        # If we had to force newline, pretend user added it
        if @doc.forceTrailingNewline()
          addNewlineDelta = new Tandem.Delta(delta.endLength, [
            new Tandem.RetainOp(0, delta.endLength)
            new Tandem.InsertOp("\n")
          ])
          this.emit(ScribeEditor.events.TEXT_CHANGE, addNewlineDelta)
          delta = delta.compose(addNewlineDelta)
        @undoManager.record(delta, oldDelta)
        unless external
          this.emit(ScribeEditor.events.TEXT_CHANGE, delta)
        console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
      )
    )

  deleteAt: (index, length) ->
    this.doSilently( =>
      @selection.preserve( =>
        return this.trackDelta( =>
          this.keepNormalized( =>
            @doc.deleteText(index, length)
          )
        )
      )
    )

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  # formatAt: (Number index, Number length, String name, Mixed value) ->
  formatAt: (index, length, name, value) ->
    this.doSilently( =>
      @selection.preserve( =>
        return this.trackDelta( =>
          this.keepNormalized( =>
            @doc.formatText(index, length, name, value)
          )
        )
      )
    )

  getDelta: ->
    return @doc.toDelta()

  getLength: ->
    return @doc.length

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text) ->
    this.doSilently( =>
      @selection.preserve( =>
        return this.trackDelta( =>
          this.keepNormalized( =>
            @doc.insertText(index, text)
          )
        )
      )
    )
    
  setSelection: (range) ->
    @selection.setRange(range)

  trackDelta: (fn) ->
    oldDelta = @doc.toDelta()
    fn()
    newDelta = @doc.toDelta()
    decompose = newDelta.decompose(oldDelta)
    compose = oldDelta.compose(decompose)
    newDelta.clearOpsCache()
    compose.clearOpsCache()
    console.assert(_.isEqual(compose, newDelta), oldDelta, newDelta, decompose, compose)
    @undoManager.record(decompose, oldDelta)
    this.emit(ScribeEditor.events.TEXT_CHANGE, decompose) unless decompose.isIdentity()
    return decompose

  update: ->
    this.doSilently( =>
      @selection.preserve( =>
        return this.trackDelta( =>
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



window.Scribe ||= {}
window.Scribe.Editor = ScribeEditor
