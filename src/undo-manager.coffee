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
    console.log 'record'
    return if changeDelta.isIdentity(changeDelta)
    @redoStack = []
    undoDelta = this.computeUndo(changeDelta, oldDelta)
    @undoStack.push({
      undo: undoDelta
      redo: changeDelta  
    })

  redo: ->
    if @redoStack.length > 0
      delta = @redoStack.pop()
      console.log 'redo', delta
      @editor.applyDelta(delta.redo)
      @undoStack.push(delta)

  undo: ->
    if @undoStack.length > 0
      delta = @undoStack.pop()
      console.log 'undo', delta
      @editor.applyDelta(delta.undo)
      @redoStack.push(delta)



window.Tandem ||= {}
window.Tandem.UndoManager = TandemUndoManager
