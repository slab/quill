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

_change = (source, dest) ->
  if @stack[source].length > 0
    change = @stack[source].pop()
    @lastRecorded = 0
    _ignoreChanges.call(this, =>
      @editor.applyDelta(change[source], { source: 'user' })
      index = getLastChangeIndex(change[source])
      @editor.setSelection(new Scribe.Range(@editor, index, index))
    )
    @stack[dest].push(change)

_ignoreChanges = (fn) ->
  oldIgnoringChanges = @ignoringChanges
  @ignoringChanges = true
  fn.call(this)
  @ignoringChanges = oldIgnoringChanges


class Scribe.UndoManager
  @DEFAULTS:
    delay: 1000
    maxStack: 100


  constructor: (@editor, options = {}) ->
    this.clear()
    @options = _.defaults(options, Scribe.UndoManager.DEFAULTS)
    @lastRecorded = 0
    this.initListeners()

  initListeners: ->
    @editor.keyboard.addHotkey(Scribe.Keyboard.hotkeys.UNDO, =>
      this.undo()
      return false
    )
    @editor.keyboard.addHotkey(Scribe.Keyboard.hotkeys.REDO, =>
      this.redo()
      return false
    )
    @ignoringChanges = false
    @editor.on(Scribe.Editor.events.USER_TEXT_CHANGE, (delta) =>
      this.record(delta, @oldDelta) unless @ignoringChanges
      @oldDelta = @editor.getDelta()
    ).on(Scribe.Editor.events.API_TEXT_CHANGE, (delta) =>
      this.record(delta, @oldDelta)
      @oldDelta = @editor.getDelta()
    )

  clear: ->
    @stack =
      undo: []
      redo: []
    @oldDelta = @editor.getDelta()

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity()
    @redoStack = []
    undoDelta = oldDelta.invert(changeDelta)
    timestamp = new Date().getTime()
    if @lastRecorded + @options.delay > timestamp and @stack.undo.length > 0
      change = @stack.undo.pop()
      undoDelta = undoDelta.compose(change.undo)
      changeDelta = change.redo.compose(changeDelta)
    else
      @lastRecorded = timestamp
    @stack.undo.push({
      redo: changeDelta
      undo: undoDelta
    })
    @stack.undo.unshift() if @stack.undo.length > @options.maxStack

  redo: ->
    _change.call(this, 'redo', 'undo')

  ###
  transformExternal: (delta) ->
    return if delta.isIdentity()
    @stack['undo'] = _.map(@stack['undo'], (change) ->
      return {
        redo: delta.follows(change.redo, true)
        undo: change.undo.follows(delta, true)
      }
    )
  ###

  undo: ->
    _change.call(this, 'undo', 'redo')


module.exports = Scribe
