_      = require('lodash')
DOM    = require('../dom')
Tandem = require('tandem-core')


class Keyboard
  @hotkeys:
    BOLD:       { key: 'B',          metaKey: true }
    INDENT:     { key: DOM.KEYS.TAB, shiftKey: false }
    ITALIC:     { key: 'I',          metaKey: true }
    OUTDENT:    { key: DOM.KEYS.TAB, shiftKey: true }
    UNDERLINE:  { key: 'U',          metaKey: true }

  constructor: (@quill, @utils, options) ->
    @hotkeys = {}
    this._initListeners()
    this._initHotkeys()
    this._initDeletes()

  addHotkey: (hotkey, callback) ->
    hotkey = if _.isObject(hotkey) then _.clone(hotkey) else { key: hotkey }
    hotkey.callback = callback
    which = if _.isNumber(hotkey.key) then hotkey.key else hotkey.key.toUpperCase().charCodeAt(0)
    @hotkeys[which] ?= []
    @hotkeys[which].push(hotkey)

  toggleFormat: (range, format) ->
    if range.isCollapsed()
      delta = @quill.getContents(Math.max(0, range.start-1), range.end)
    else
      delta = @quill.getContents(range)
    value = delta.ops.length == 0 or !_.all(delta.ops, (op) ->
      return op.attributes[format]
    )
    if range.isCollapsed()
      @quill.prepareFormat(format, value)
    else
      @quill.formatText(range, format, value, 'user')
    toolbar = @quill.getModule('toolbar')
    toolbar.setActive(format, value) if toolbar?

  _initDeletes: ->
    _.each([DOM.KEYS.DELETE, DOM.KEYS.BACKSPACE], (key) =>
      this.addHotkey(key, =>
        # Prevent deleting if editor is already blank (or just empty newline)
        return @quill.getLength() > 1
      )
    )

  _initHotkeys: ->
    this.addHotkey(Keyboard.hotkeys.INDENT, (range) =>
      this._onTab(range, false)
      return false
    )
    this.addHotkey(Keyboard.hotkeys.OUTDENT, (range) =>
      # TODO implement when we implement multiline tabs
      return false
    )
    _.each(['bold', 'italic', 'underline'], (format) =>
      this.addHotkey(Keyboard.hotkeys[format.toUpperCase()], (range) =>
        this.toggleFormat(range, format)
        return false
      )
    )

  _initListeners: ->
    DOM.addEventListener(@quill.root, 'keydown', (event) =>
      prevent = false
      range = @quill.getSelection()
      _.each(@hotkeys[event.which], (hotkey) =>
        return if hotkey.metaKey? and (event.metaKey != hotkey.metaKey and event.ctrlKey != hotkey.metaKey)
        return if hotkey.shiftKey? and event.shiftKey != hotkey.shiftKey
        prevent = hotkey.callback(range) == false or prevent
      )
      return !prevent
    )

  _onTab: (range, shift = false) ->
    # TODO implement multiline tab behavior
    # Behavior according to Google Docs + Word
    # When tab on one line, regardless if shift is down, delete selection and insert a tab
    # When tab on multiple lines, indent each line if possible, outdent if shift is down
    delta = Tandem.Delta.makeDelta({
      startLength: @quill.getLength()
      ops: [
        { start: 0, end: range.start }
        { value: "\t" }
        { start: range.end, end: @quill.getLength() }
      ]
    })
    @quill.updateContents(delta)
    @quill.setSelection(range.start + 1, range.start + 1)


module.exports = Keyboard
