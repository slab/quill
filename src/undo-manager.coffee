class ScribeUndoManager
  @DEFAULTS:
    delay: 1000

  @computeUndo: (changeDelta, originalDelta) ->
    index = offset = 0
    deltas = []
    _.each(changeDelta.deltas, (delta) ->
      if JetDelta.isInsert(delta)
        offset += delta.getLength()
      else if JetDelta.isRetain(delta)
        start = index + offset
        if delta.start > index
          length = delta.start - index
          deletedDelta = originalDelta.getDeltasAt(index, length)
          deltas = deltas.concat(deletedDelta)
          offset -= length
        deltas.push(new JetRetain(start, start + delta.getLength(), _.clone(delta.attributes)))
        index = delta.end
      else
        console.error("Unrecognized type in delta", delta)
    )
    if changeDelta.endLength < changeDelta.startLength + offset
      deletedDelta = originalDelta.getDeltasAt(changeDelta.endLength, changeDelta.startLength - changeDelta.endLength + offset)
      deltas = deltas.concat(deletedDelta)
    return new JetDelta(changeDelta.endLength, changeDelta.startLength, deltas)

  @getLastChangeIndex: (delta) ->
    lastChangeIndex = index = offset = 0
    _.each(delta.deltas, (delta) ->
      if JetDelta.isInsert(delta)
        offset += delta.getLength()
        lastChangeIndex = index + offset
      else if JetDelta.isRetain(delta)
        if delta.start > index
          lastChangeIndex = index + offset
          offset -= (delta.start - index)
        index = delta.end
    )
    if delta.endLength < delta.startLength + offset
      lastChangeIndex = delta.endLength
    return lastChangeIndex


  constructor: (@editor, options = {}) ->
    @destructors = []
    @undoStack = []
    @redoStack = []
    @options = _.extend(ScribeUndoManager.DEFAULTS, options)
    @lastRecorded = 0
    this.initListeners()

  destroy: ->
    _.each(@destructors, (fn) =>
      fn.call(this)
    )
    @destructors = null

  initListeners: ->
    @editor.keyboard.addHotkey(Scribe.Keyboard.HOTKEYS.UNDO, =>
      this.undo()
    )
    @editor.keyboard.addHotkey(Scribe.Keyboard.HOTKEYS.REDO, =>
      this.redo()
    )

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity(changeDelta)
    @redoStack = []
    undoDelta = ScribeUndoManager.computeUndo(changeDelta, oldDelta)
    timestamp = new Date().getTime()
    if @lastRecorded + @options.delay > timestamp and @undoStack.length > 0
      change = @undoStack.pop()
      undoDelta = JetSync.compose(undoDelta, change.undo.delta)
      changeDelta = JetSync.compose(change.redo.delta, changeDelta)
    else
      @lastRecorded = timestamp
    @undoStack.push({
      undo:
        cursor: ScribeUndoManager.getLastChangeIndex(undoDelta)
        delta: undoDelta
      redo:
        cursor: ScribeUndoManager.getLastChangeIndex(changeDelta)
        delta: changeDelta  
    })

  redo: ->
    if @redoStack.length > 0
      change = @redoStack.pop()
      @editor.applyDelta(change.redo.delta)
      @editor.setSelection(new Scribe.Range(@editor, change.redo.cursor, change.redo.cursor))
      @undoStack.push(change)

  undo: ->
    if @undoStack.length > 0
      change = @undoStack.pop()
      @editor.applyDelta(change.undo.delta)
      @editor.setSelection(new Scribe.Range(@editor, change.undo.cursor, change.undo.cursor))
      @redoStack.push(change)



window.Scribe ||= {}
window.Scribe.UndoManager = ScribeUndoManager
