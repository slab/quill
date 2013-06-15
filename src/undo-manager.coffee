Scribe = require('./scribe')
Tandem = require('tandem-core')


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

  @getLastChangeIndex: (delta) ->
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

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity(changeDelta)
    @redoStack = []
    undoDelta = Scribe.UndoManager.computeUndo(changeDelta, oldDelta)
    timestamp = new Date().getTime()
    if @lastRecorded + @options.delay > timestamp and @undoStack.length > 0
      change = @undoStack.pop()
      undoDelta = undoDelta.compose(change.undo.delta)
      changeDelta = change.redo.delta.compose(changeDelta)
    else
      @lastRecorded = timestamp
    @undoStack.push({
      undo:
        cursor: Scribe.UndoManager.getLastChangeIndex(undoDelta)
        delta: undoDelta
      redo:
        cursor: Scribe.UndoManager.getLastChangeIndex(changeDelta)
        delta: changeDelta  
    })

  redo: ->
    if @redoStack.length > 0
      change = @redoStack.pop()
      @editor.applyDelta(change.redo.delta)
      @editor.setSelection(new Range(@editor, change.redo.cursor, change.redo.cursor))
      @undoStack.push(change)

  undo: ->
    if @undoStack.length > 0
      change = @undoStack.pop()
      @editor.applyDelta(change.undo.delta)
      @editor.setSelection(new Range(@editor, change.undo.cursor, change.undo.cursor))
      @redoStack.push(change)


module.exports = Scribe
