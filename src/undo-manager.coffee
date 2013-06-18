Scribe = require('./scribe')
Tandem = require('tandem-core')


getLastChangeIndex = (delta) ->
  lastChangeIndex = index = offset = 0
  _.each(delta.ops, (op) ->
    if Tandem.Delta.isInsert(op)
      offset += op.getLength()
      lastChangeIndex = index + offset
    else if Tandem.Delta.isRetain(op)
      if op.start > index
        lastChangeIndex = index + offset
        offset -= (op.start - index)
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

  @computeUndo: (changeDelta, originalDelta) ->
    index = offset = 0
    ops = []
    _.each(changeDelta.ops, (op) ->
      if Tandem.Delta.isInsert(op)
        offset += op.getLength()
      else if Tandem.Delta.isRetain(op)
        start = index + offset
        if op.start > index
          length = op.start - index
          deletedOps = originalDelta.getOpsAt(index, length)
          ops = ops.concat(deletedOps)
          offset -= length
        ops.push(new Tandem.RetainOp(start, start + op.getLength(), op.attributes))
        index = op.end
      else
        console.error("Unrecognized type in op", op)
    )
    if changeDelta.endLength < changeDelta.startLength + offset
      deletedDeltas = originalDelta.getOpsAt(changeDelta.endLength - offset, changeDelta.startLength - changeDelta.endLength + offset)
      ops = ops.concat(deletedDeltas)
    return new Tandem.Delta(changeDelta.endLength, changeDelta.startLength, ops)


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
      oldDelta = delta
    )

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity(changeDelta)
    @redoStack = []
    undoDelta = Scribe.UndoManager.computeUndo(changeDelta, oldDelta)
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
        console.log 'undoing'
        @editor.applyDelta(change.undo, { source: 'user' })
        index = getLastChangeIndex(change.undo)
        @editor.setSelection(new Scribe.Range(@editor, index, index))
      )
      @redoStack.push(change.undo)


module.exports = Scribe
