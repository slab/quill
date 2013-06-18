Scribe = require('./scribe')
Tandem = require('tandem-core')


getLastChangeIndex = (delta) ->
  lastChangeIndex = index = offset = 0
  _.each(delta.ops, (op) ->
    # Insert
    if Tandem.Delta.isInsert(op)
      offset += op.getLength()
      lastChangeIndex = index + offset
    else if Tandem.Delta.isRetain(op)
      # Delete
      if op.start > index
        lastChangeIndex = index + offset
        offset -= (op.start - index)
      # Format
      if _.keys(op.attributes).length > 0
        lastChangeIndex = op.end + offset
      index = op.end
  )
  if delta.endLength < delta.startLength + offset
    lastChangeIndex = delta.endLength
  return lastChangeIndex

_ignoreChanges = (fn) ->
  oldIgnoringChanges = @ignoringChanges
  @ignoringChanges = true
  fn.call(this)
  @ignoringChanges = oldIgnoringChanges


class Scribe.UndoManager
  @DEFAULTS:
    delay: 1000


  constructor: (@editor, options = {}) ->
    @undoStack = []
    @redoStack = []
    @options = _.defaults(options, Scribe.UndoManager.DEFAULTS)
    @lastRecorded = 0
    this.initListeners()

  initListeners: ->
    @editor.keyboard.addHotkey(Scribe.Keyboard.HOTKEYS.UNDO, =>
      this.undo()
    )
    @editor.keyboard.addHotkey(Scribe.Keyboard.HOTKEYS.REDO, =>
      this.redo()
    )
    oldDelta = @editor.getDelta()
    @ignoringChanges = false
    @editor.on(Scribe.Editor.events.USER_TEXT_CHANGE, (delta) =>
      return if @ignoringChanges
      this.record(delta, oldDelta)
      oldDelta = @editor.getDelta()
    )

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity(changeDelta)
    @redoStack = []
    undoDelta = oldDelta.invert(changeDelta)
    timestamp = new Date().getTime()
    ###
    if @lastRecorded + @options.delay > timestamp and @undoStack.length > 0
      change = @undoStack.pop()
      undoDelta = change.undo.compose(undoDelta)
      changeDelta = change.redo.compose(changeDelta)
    else
      @lastRecorded = timestamp
    ###
    @undoStack.push({
      redo: changeDelta
      undo: undoDelta
    })

  redo: ->
    if @redoStack.length > 0
      change = @redoStack.pop()
      _ignoreChanges.call(this, =>
        @editor.applyDelta(change.redo, { source: 'user' })
        index = getLastChangeIndex(change.redo)
        @editor.setSelection(new Scribe.Range(@editor, index, index))
      )
      @undoStack.push(change.redo)

  undo: ->
    if @undoStack.length > 0
      change = @undoStack.pop()
      _ignoreChanges.call(this, =>
        @editor.applyDelta(change.undo, { source: 'user' })
        index = getLastChangeIndex(change.undo)
        @editor.setSelection(new Scribe.Range(@editor, index, index))
      )
      @redoStack.push(change.undo)


module.exports = Scribe
