Quill  = require('../quill')
_      = Quill.require('lodash')
Tandem = Quill.require('tandem-core')


class UndoManager
  @DEFAULTS:
    delay: 1000
    maxStack: 100

  @hotkeys:
    UNDO: { key: 'Z', metaKey: true }
    REDO: { key: 'Z', metaKey: true, shiftKey: true }

  constructor: (@quill, @options = {}) ->
    @lastRecorded = 0
    @emittedDelta = null
    this.clear()
    this.initListeners()

  initListeners: ->
    @quill.onModuleLoad('keyboard', (keyboard) =>
      keyboard.addHotkey(UndoManager.hotkeys.UNDO, =>
        this.undo()
        return false
      )
      keyboard.addHotkey(UndoManager.hotkeys.REDO, =>
        this.redo()
        return false
      )
    )
    @quill.on(@quill.constructor.events.TEXT_CHANGE, (delta, origin) =>
      if delta.isEqual(@emittedDelta)
        @emittedDelta = null
        return
      this.record(delta, @oldDelta)
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
          # TODO log warning
          this.clear()
          @lastRecorded = timestamp
      else
        @lastRecorded = timestamp
      @stack.undo.push({
        redo: changeDelta
        undo: undoDelta
      })
      @stack.undo.unshift() if @stack.undo.length > @options.maxStack
    catch ignored
      # TODO log warning
      this.clear()

  redo: ->
    this._change('redo', 'undo')

  undo: ->
    this._change('undo', 'redo')

  _getLastChangeIndex: (delta) ->
    lastIndex = 0
    delta.apply((index, text) ->
      lastIndex = Math.max(index + text.length, lastIndex)
    , (index, length) ->
      lastIndex = Math.max(index, lastIndex)
    , (index, length) ->
      lastIndex = Math.max(index + length, lastIndex)
    )
    return lastIndex

  _change: (source, dest) ->
    if @stack[source].length > 0
      change = @stack[source].pop()
      @lastRecorded = 0
      @emittedDelta = change[source]
      @quill.updateContents(change[source], 'user')
      @emittedDelta = null
      index = this._getLastChangeIndex(change[source])
      @quill.setSelection(index, index)
      @oldDelta = @quill.getContents()
      @stack[dest].push(change)


Quill.registerModule('undo-manager', UndoManager)
module.exports = UndoManager
