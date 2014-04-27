_      = require('lodash')
DOM    = require('../dom')
Line   = require('../line')
Tandem = require('tandem-core')


class Keyboard
  @hotkeys:
    BOLD:       { key: 'B',          meta: true }
    INDENT:     { key: DOM.KEYS.TAB, shift: false }
    ITALIC:     { key: 'I',          meta: true }
    OUTDENT:    { key: DOM.KEYS.TAB, shift: true }
    UNDERLINE:  { key: 'U',          meta: true }
    UNDO:       { key: 'Z',          meta: true, shift: false }
    REDO:       { key: 'Z',          meta: true, shift: true }

  @NAVIGATION: [DOM.KEYS.UP, DOM.KEYS.DOWN, DOM.KEYS.LEFT, DOM.KEYS.RIGHT]

  constructor: (@quill, @editorContainer, options) ->
    @hotkeys = {}
    this._initListeners()
    this._initHotkeys()
    this._initDeletes()

  addHotkey: (hotkey, callback) ->
    hotkey = if _.isObject(hotkey) then _.clone(hotkey) else { key: hotkey }
    hotkey.key = hotkey.key.toUpperCase().charCodeAt(0) if _.isString(hotkey.key)
    hotkey.callback = callback
    @hotkeys[hotkey.key] ?= []
    @hotkeys[hotkey.key].push(hotkey)

  toggleFormat: (range, format) ->
    delta = @quill.getContents(range)
    hasFormat = _.all(delta.ops, (op) ->
      return op.attributes[format]
    )
    @quill.formatText(range, format, !hasFormat, { source: 'user' })

  _initDeletes: ->
    _.each([DOM.KEYS.DELETE, DOM.KEYS.BACKSPACE], (key) =>
      this.addHotkey(key, =>
        # Prevent deleting if editor is already blank
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
    DOM.addEventListener(@editorContainer, 'keydown', (event) =>
      if @hotkeys[event.which]?
        prevent = false
        range = @quill.getSelection()
        if range?   # Should only not be the case if keydown was programmatically triggered
          _.each(@hotkeys[event.which], (hotkey) =>
            return if hotkey.meta? and (event.metaKey != hotkey.meta and event.ctrlKey != hotkey.meta)
            return if hotkey.shift? and event.shiftKey != hotkey.shift
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
