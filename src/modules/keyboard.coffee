_        = require('lodash')
DOM      = require('../dom')
Line     = require('../line')


class Keyboard
  @keys:
    BACKSPACE : 8
    TAB       : 9
    ENTER     : 13
    LEFT      : 37
    UP        : 38
    RIGHT     : 39
    DOWN      : 40
    DELETE    : 46

  @hotkeys:
    BOLD:       { key: 'B',       meta: true }
    INDENT:     { key: @keys.TAB, shift: false }
    ITALIC:     { key: 'I',       meta: true }
    OUTDENT:    { key: @keys.TAB, shift: true }
    UNDERLINE:  { key: 'U',       meta: true }
    UNDO:       { key: 'Z',       meta: true, shift: false }
    REDO:       { key: 'Z',       meta: true, shift: true }
    SELECT_ALL: { key: 'A',       meta: true }

  @NAVIGATION: [@keys.UP, @keys.DOWN, @keys.LEFT, @keys.RIGHT]

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

  indent: (selection, increment) ->
    lines = selection.getLines()
    applyIndent = (line, format) =>
      if increment
        indent = if _.isNumber(line.formats[format]) then line.formats[format] else (if line.formats[format] then 1 else 0)
        indent += increment
        indent = Math.min(Math.max(indent, Line.MIN_INDENT), Line.MAX_INDENT)
      else
        indent = false
      index = Position.getIndex(line.node, 0)
      @quill.formatText(index, 0, format, indent)

    _.each(lines, (line) =>
      if line.formats.bullet?
        applyIndent(line, 'bullet')
      else if line.formats.list?
        applyIndent(line, 'list')
      else
        applyIndent(line, 'indent')
    )

  toggleFormat: (range, format) ->
    formats = range.getFormats()
    value = !formats[format]
    @quill.formatText(range, format, value, { source: 'user' })

  _initDeletes: ->
    _.each([Keyboard.keys.DELETE, Keyboard.keys.BACKSPACE], (key) =>
      this.addHotkey(key, =>
        # Prevent deleting if editor is already blank (browser quirk fix)
        return @quill.getLength() > 1
      )
    )

  _initHotkeys: ->
    this.addHotkey(Keyboard.hotkeys.OUTDENT, (range) =>
      this._onTab(range, true)
      return false
    )
    this.addHotkey(Keyboard.hotkeys.INDENT, (range) =>
      this._onTab(range, false)
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
        _.each(@hotkeys[event.which], (hotkey) =>
          return if hotkey.meta? and (event.metaKey != hotkey.meta and event.ctrlKey != hotkey.meta)
          return if hotkey.shift? and event.shiftKey != hotkey.shift
          @quill.updateSelection({ silent: true })
          selection = @quill.getSelection()
          return unless selection?
          prevent = hotkey.callback.call(hotkey.callback, selection) == false or prevent
        )
      return !prevent
    )

  _onTab: (range, shift = false) ->
    # Behavior according to Google Docs + Word
    # When tab on one line, regardless if shift is down, delete selection and insert a tab
    # When tab on multiple lines, indent each line if possible, outdent if shift is down
    lines = range.getLines()
    if lines.length > 1
      index = Position.getIndex(lines[0].node)
      start = range.start.index + (if shift then -1 else 1)
      offsetChange = 0
      _.each(lines, (line) =>
        if !shift
          @quill.insertText(index, '\t', {}, { source: 'user' })
          offsetChange += 1
        else if line.leaves.first.text[0] == '\t'
          @quill.deleteText(index, 1, { source: 'user' })
          offsetChange -= 1
        else if line == lines[0]
          start = range.start.index
        index += line.length
      )
      end = range.end.index + offsetChange
      @quill.setSelection(start, end)
    else
      index = @range.start.getIndex()
      @quill.deleteText(@range, { source: 'user' })
      @quill.insertText(index, "\t", {}, { source: 'user' })
      @quill.setSelection(index + 1, index + 1)


module.exports = Keyboard
