_      = require('lodash')
Tandem = require('tandem-core')


class UndoManager
  DEFAULTS:
    delay: 1000
    maxStack: 100

  constructor: (@quill, @editorContainer, @options = {}) ->
    @lastRecorded = 0
    this.clear()
    this.initListeners()

  initListeners: ->
    @quill.onModuleLoad('keyboard', (keyboard) =>
      keyboard.addHotkey(keyboard.constructor.hotkeys.UNDO, =>
        this.undo()
        return false
      )
      keyboard.addHotkey(keyboard.constructor.hotkeys.REDO, =>
        this.redo()
        return false
      )
    )
    @ignoringChanges = false
    @quill.on(@quill.constructor.events.TEXT_CHANGE, (delta, origin) =>
      this.record(delta, @oldDelta) unless @ignoringChanges and origin == 'user'
      @oldDelta = @quill.getContents()
    )

  clear: ->
    @stack =
      undo: []
      redo: []
    @oldDelta = @quill.getContents()

  record: (changeDelta, oldDelta) ->
    return if changeDelta.isIdentity()
    @stack.redo = []
    try
      undoDelta = oldDelta.invert(changeDelta)
      timestamp = new Date().getTime()
      if @lastRecorded + @options.delay > timestamp and @stack.undo.length > 0
        change = @stack.undo.pop()
        if undoDelta.canCompose(change.undo) and change.redo.canCompose(changeDelta)
          undoDelta = undoDelta.compose(change.undo)
          changeDelta = change.redo.compose(changeDelta)
        else
          console.warn "Unable to compose change, clearing undo stack" if console?
          this.clear()
          @lastRecorded = timestamp
      else
        @lastRecorded = timestamp
      @stack.undo.push({
        redo: changeDelta
        undo: undoDelta
      })
      @stack.undo.unshift() if @stack.undo.length > @options.maxStack
      return true
    catch ignored
      this.clear()
      return false

  redo: ->
    this._change('redo', 'undo')

  undo: ->
    this._change('undo', 'redo')

  _getLastChangeIndex: (delta) ->
    lastChangeIndex = index = offset = 0
    _.each(delta.ops, (op) ->
      # Insert
      if Tandem.InsertOp.isInsert(op)
        offset += op.getLength()
        lastChangeIndex = index + offset
      else if Tandem.RetainOp.isRetain(op)
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

  _change: (source, dest) ->
    if @stack[source].length > 0
      change = @stack[source].pop()
      @lastRecorded = 0
      this._ignoreChanges( =>
        @quill.updateContents(change[source], { source: 'user' })
        index = this._getLastChangeIndex(change[source])
        @quill.setSelection(index, index)
      )
      @stack[dest].push(change)

  _ignoreChanges: (fn) ->
    oldIgnoringChanges = @ignoringChanges
    @ignoringChanges = true
    fn.call(this)
    @ignoringChanges = oldIgnoringChanges


module.exports = UndoManager
