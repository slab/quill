Quill = require('../quill')
_     = Quill.require('lodash')
Delta = Quill.require('delta')


getLastChangeIndex: (delta) ->
  index = lastIndex = 0
  delta.ops.forEach((op) ->
    if op.insert?
      lastIndex = Math.max(index + (op.insert.length or 1), lastIndex)
    else if op.delete?
      lastIndex = Math.max(index, lastIndex)
    else if op.retain?
      if op.attributes?
        lastIndex = Math.max(index + op.retain, lastIndex)
      index += op.retain
  )
  return lastIndex


class UndoManager
  @DEFAULTS:
    delay: 1000
    maxStack: 100
    userOnly: false

  constructor: (@quill, @options = {}) ->
    @lastRecorded = 0
    @ignoreChange = false
    this.clear()
    @quill.on(@quill.constructor.events.TEXT_CHANGE, (delta, source) =>
      return if @ignoreChange
      if !@options.userOnly or source == Quill.sources.USER
        this.record(delta, @oldDelta)
      else
        this.transform(delta)
      @oldDelta = @quill.getContents()
    )

  change: (source, dest) ->
    return unless @stack[source].length > 0
    change = @stack[source].pop()
    @lastRecorded = 0
    @ignoreChange = true
    @quill.updateContents(change[source], Quill.sources.USER)
    @ignoreChange = false
    index = this.getLastChangeIndex(change[source])
    @quill.setSelection(index, index)
    @oldDelta = @quill.getContents()
    @stack[dest].push(change)

  clear: ->
    @stack =
      undo: []
      redo: []
    @oldDelta = @quill.getContents()

  record: (changeDelta, oldDelta) ->
    return unless changeDelta.ops.length > 0
    @stack.redo = []
    try
      undoDelta = @quill.getContents().diff(@oldDelta)
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
    catch ignored
      @quill.emit(@quill.constructor.events.DEBUG, 'warning', 'Could not record change... clearing undo stack.')
      this.clear()

  redo: ->
    this.change('redo', 'undo')

  transform: (delta) ->
    @oldDelta = delta.transform(@oldDelta, true)
    for change in @stack.undo
      change.undo = delta.transform(change.undo, true)
      change.redo = delta.transform(change.redo, true)
    for change in @stack.redo
      change.undo = delta.transform(change.undo, true)
      change.redo = delta.transform(change.redo, true)

  undo: ->
    this.change('undo', 'redo')


Quill.registerModule('undo-manager', UndoManager)
module.exports = UndoManager
