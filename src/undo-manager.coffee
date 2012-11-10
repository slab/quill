class TandemUndoManager
  @computeUndo: (changeDelta, originalDelta) ->
    


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
    @undoStack.push(undoDelta)

  redo: ->
    if @redoStack.length > 0
      delta = @redoStack.pop()
      console.log 'redo', delta
      @editor.applyDelta(delta)
      @undoStack.push(delta)

  undo: ->
    if @undoStack.length > 0
      delta = @undoStack.pop()
      console.log 'undo', delta
      @editor.applyDelta(delta)
      @redoStack.push(delta)



window.Tandem ||= {}
window.Tandem.UndoManager = TandemUndoManager
