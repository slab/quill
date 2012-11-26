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
  @CURSOR_PREFIX: 'cursor-'
  @DEFAULTS:
    cursor: 0
    enabled: true
    styles: {}
  @events: 
    TEXT_CHANGE      : 'text-change'
    SELECTION_CHANGE : 'selection-change'

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
    @undoManager.destroy()
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
    @doc = new Tandem.Document(@contentWindow.document.getElementById(TandemEditor.CONTAINER_ID))
    @selection = new Tandem.Selection(this)
    @keyboard = new Tandem.Keyboard(this)
    @undoManager = new Tandem.UndoManager(this)
    @pasteManager = new Tandem.PasteManager(this)
    this.initListeners()
    @ignoreDomChanges = false
    TandemEditor.editors.push(this)

  disable: ->
    this.doSilently( =>
      @doc.root.setAttribute('contenteditable', false)
    )

  enable: ->
    if !@doc.root.getAttribute('contenteditable')
      this.doSilently( =>
        @doc.root.setAttribute('contenteditable', true)
      )

  initListeners: ->
    modified = false
    onEdit = =>
      return if @ignoreDomChanges or !@destructors? or !modified
      modified = false
      this.update()
    onSubtreeModified = =>
      return if @ignoreDomChanges or !@destructors?
      modified = true
    interval = setInterval(onEdit, 500)
    @doc.root.addEventListener('DOMSubtreeModified', onSubtreeModified)
    @destructors.push( ->
      @doc.root.removeEventListener('DOMSubtreeModified', onSubtreeModified)
      clearInterval(interval)
    )

  keepNormalized: (fn) ->
    fn.call(this)
    @doc.rebuildDirty()
    @doc.forceTrailingNewline()

  # applyAttribute: (TandemRange range, String attr, Mixed value) ->
  # applyAttribute: (Number index, Number length, String attr, Mixed value) ->
  applyAttribute: (index, length, attr, value, emitEvent = true) ->
    this.doSilently( =>
      delta = this.trackDelta( =>
        @selection.preserve( =>
          this.keepNormalized( =>
            @doc.applyAttribute(index, length, attr, value)
          )
        )
      )
      this.emit(TandemEditor.events.TEXT_CHANGE, delta) if emitEvent
    )

  applyDelta: (delta, emitEvent = true) ->
    console.assert(delta.startLength == @doc.length, "Trying to apply delta to incorrect doc length", delta, @doc, @doc.root)
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
      _.each(delta.attributes, (value, attr) =>
        @doc.applyAttribute(delta.start, delta.end - delta.start, attr, value) if value == null
      )
      _.each(delta.attributes, (value, attr) =>
        @doc.applyAttribute(delta.start, delta.end - delta.start, attr, value) if value?
      )
    )
    @doc.forceTrailingNewline()
    newDelta = @doc.toDelta()
    composed = JetSync.compose(oldDelta, delta)
    composed.compact()
    console.assert(_.isEqual(composed, newDelta), oldDelta, delta, composed, newDelta)
    this.emit(TandemEditor.events.TEXT_CHANGE, delta) if emitEvent

  deleteAt: (index, length, emitEvent = true) ->
    this.doSilently( =>
      delta = this.trackDelta( =>
        @selection.preserve( =>
          this.keepNormalized( =>
            @doc.deleteText(index, length)
          )
        )
      )
      this.emit(TandemEditor.events.TEXT_CHANGE, delta) if emitEvent
    )

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

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
    this.doSilently( =>
      delta = this.trackDelta( =>
        @selection.preserve( =>
          this.keepNormalized( =>
            @doc.insertText(index, text)
          )
        )
      )
      this.emit(TandemEditor.events.TEXT_CHANGE, delta) if emitEvent
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
        @selection.update(true)
      )
      this.emit(TandemEditor.events.TEXT_CHANGE, delta) if emitEvent and !delta.isIdentity()
    )



window.Tandem ||= {}
window.Tandem.Editor = TandemEditor
