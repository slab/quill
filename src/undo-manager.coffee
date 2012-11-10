class TandemUndoManager
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


  constructor: (@editor) ->
    @destructors = []
    @undoStack = []
    @redoStack = []
    this.initListeners()

  destroy: ->
    _.each(@destructors, (fn) =>
      fn.call(this)
    )
    @destructors = null

  initListeners: ->
    onKey = (event) =>
      if event.which == Tandem.Keyboard.KEYS.Z && event.metaKey
        if event.shiftKey
          this.redo()
        else
          this.undo()
        event.preventDefault()
        return false
    @editor.doc.root.addEventListener('keydown', onKey)
    @destructors.push( =>
      @editor.doc.root.removeEventListener('keydown', onKey)
    )

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity(changeDelta)
    @redoStack = []
    undoDelta = TandemUndoManager.computeUndo(changeDelta, oldDelta)
    @undoStack.push({
      undo:
        cursor: TandemUndoManager.getLastChangeIndex(undoDelta)
        delta: undoDelta
      redo:
        cursor: TandemUndoManager.getLastChangeIndex(changeDelta)
        delta: changeDelta  
    })

  redo: ->
    if @redoStack.length > 0
      change = @redoStack.pop()
      @editor.applyDelta(change.redo.delta)
      @editor.setSelection(new Tandem.Range(@editor, change.redo.cursor, change.redo.cursor))
      @undoStack.push(change)

  undo: ->
    if @undoStack.length > 0
      change = @undoStack.pop()
      @editor.applyDelta(change.undo.delta)
      @editor.setSelection(new Tandem.Range(@editor, change.undo.cursor, change.undo.cursor))
      @redoStack.push(change)



window.Tandem ||= {}
window.Tandem.UndoManager = TandemUndoManager
