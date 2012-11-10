class TandemUndoManager
  constructor: (@editor) ->
    @destructors = []
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

  record: (delta, oldDelta) ->
    console.log 'record'

  redo: ->
    console.log 'redo'

  undo: ->
    console.log 'undo'



window.Tandem ||= {}
window.Tandem.UndoManager = TandemUndoManager
