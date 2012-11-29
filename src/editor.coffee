class ScribeEditor extends EventEmitter2
  @editors: []

  @CONTAINER_ID: 'Scribe-container'
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
    @destructors = []
    this.reset(true)
    this.enable() if @options.enabled

  destroy: ->
    this.disable()
    @renderer.destroy()
    @selection.destroy()
    @undoManager.destroy()
    _.each(@destructors, (fn) =>
      fn.call(this)
    )
    @destructors = null

  reset: (keepHTML = false) ->
    @ignoreDomChanges = true
    options = _.clone(@options)
    options.keepHTML = keepHTML
    @renderer = new Scribe.Renderer(@iframeContainer, options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @contentWindow.document.getElementById(ScribeEditor.CONTAINER_ID)
    @doc = new Scribe.Document(@root)
    @selection = new Scribe.Selection(this, options.cursor)
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
      return if @ignoreDomChanges or !@destructors?
      this.update()
    onSubtreeModified = =>
      return if @ignoreDomChanges or !@destructors?
      toCall = onEditOnce
      _.defer( =>
        toCall.call(null)
      )
    onEditOnce = _.once(onEdit)
    @root.addEventListener('DOMSubtreeModified', onSubtreeModified)
    @destructors.push( ->
      @root.removeEventListener('DOMSubtreeModified', onSubtreeModified)
    )

  keepNormalized: (fn) ->
    fn.call(this)
    @doc.rebuildDirty()
    @doc.forceTrailingNewline()

  applyDelta: (delta, emitEvent = true) ->
    console.assert(delta.startLength == @doc.length, "Trying to apply delta to incorrect doc length", delta, @doc, @root)
    index = 0       # Stores where the last retain end was, so if we see another one, we know to delete
    offset = 0      # Tracks how many characters inserted to correctly offset new text
    oldDelta = @doc.toDelta()
    retains = []
    _.each(delta.deltas, (delta) =>
      if JetDelta.isInsert(delta)
        @doc.insertText(index + offset, delta.text)
        retains.push(new JetRetain(index + offset, index + offset + delta.text.length, delta.attributes))
        offset += delta.getLength()
      else if JetDelta.isRetain(delta)
        if delta.start > index
          @doc.deleteText(index + offset, delta.start - index)
          offset -= (delta.start - index)
        retains.push(new JetRetain(delta.start + offset, delta.end + offset, delta.attributes))
        index = delta.end
      else
        console.warn('Unrecognized type in delta', delta)
    )
    # If end of text was deleted
    if delta.endLength < delta.startLength + offset
      @doc.deleteText(delta.endLength, delta.startLength + offset - delta.endLength)
    retainDelta = new JetDelta(delta.endLength, delta.endLength, retains)
    retainDelta.compact()
    _.each(retainDelta.deltas, (delta) =>
      _.each(delta.attributes, (value, format) =>
        @doc.formatText(delta.start, delta.end - delta.start, format, value) if value == null
      )
      _.each(delta.attributes, (value, format) =>
        @doc.formatText(delta.start, delta.end - delta.start, format, value) if value?
      )
    )
    @doc.forceTrailingNewline()
    newDelta = @doc.toDelta()
    composed = JetSync.compose(oldDelta, delta)
    composed.compact()
    console.assert(_.isEqual(composed, newDelta), oldDelta, delta, composed, newDelta)
    this.emit(ScribeEditor.events.TEXT_CHANGE, delta) if emitEvent

  deleteAt: (index, length, emitEvent = true) ->
    this.doSilently( =>
      @selection.preserve( =>
        delta = this.trackDelta( =>
          this.keepNormalized( =>
            @doc.deleteText(index, length)
          )
        )
        this.emit(ScribeEditor.events.TEXT_CHANGE, delta) if emitEvent
        return delta
      )
    )

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  # formatAt: (Number index, Number length, String name, Mixed value) ->
  formatAt: (index, length, name, value, emitEvent = true) ->
    this.doSilently( =>
      @selection.preserve( =>
        delta = this.trackDelta( =>
          this.keepNormalized( =>
            @doc.formatText(index, length, name, value)
          )
        )
        this.emit(ScribeEditor.events.TEXT_CHANGE, delta) if emitEvent
        return delta
      )
    )

  getDelta: ->
    return @doc.toDelta()

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text, emitEvent = true) ->
    this.doSilently( =>
      @selection.preserve( =>
        delta = this.trackDelta( =>
          this.keepNormalized( =>
            @doc.insertText(index, text)
          )
        )
        this.emit(ScribeEditor.events.TEXT_CHANGE, delta) if emitEvent
        return delta
      )
    )
    
  setSelection: (range) ->
    @selection.setRange(range)

  trackDelta: (fn) ->
    oldDelta = @doc.toDelta()
    fn()
    newDelta = @doc.toDelta()
    decompose = JetSync.decompose(oldDelta, newDelta)
    compose = JetSync.compose(oldDelta, decompose)
    console.assert(_.isEqual(compose, newDelta), oldDelta, newDelta, decompose, compose)
    @undoManager.record(decompose, oldDelta)
    return decompose

  update: (emitEvent = true) ->
    this.doSilently( =>
      @selection.preserve( =>
        delta = this.trackDelta( =>
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
        this.emit(ScribeEditor.events.TEXT_CHANGE, delta) if emitEvent and !delta.isIdentity()
        return delta
      )
    )



window.Scribe ||= {}
window.Scribe.Editor = ScribeEditor
