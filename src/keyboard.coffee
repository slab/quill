Scribe = require('./scribe')


_initDeletes = ->
  _.each([Scribe.Keyboard.keys.DELETE, Scribe.Keyboard.keys.BACKSPACE], (key) =>
    this.addHotkey(key, =>
      # Prevent deleting if editor is already blank (browser quirk fix)
      return @editor.getLength() > 1
    )
  )

_initHotkeys = ->
  this.addHotkey(Scribe.Keyboard.hotkeys.OUTDENT, (range) =>
    _onTab.call(this, range, true)
    return false
  )
  this.addHotkey(Scribe.Keyboard.hotkeys.INDENT, (range) =>
    _onTab.call(this, range, false)
    return false
  )
  _.each(['bold', 'italic', 'underline'], (format) =>
    this.addHotkey(Scribe.Keyboard.hotkeys[format.toUpperCase()], (range) =>
      this.toggleFormat(range, format)
      return false
    )
  )

_initListeners = ->
  Scribe.DOM.addEventListener(@editor.root, 'keydown', (event) =>
    event ||= window.event
    if @hotkeys[event.which]?
      prevent = false
      _.each(@hotkeys[event.which], (hotkey) =>
        return if hotkey.meta? and (event.metaKey != hotkey.meta and event.ctrlKey != hotkey.meta)
        return if hotkey.shift? and event.shiftKey != hotkey.shift
        @editor.selection.update(true)
        selection = @editor.getSelection()
        return unless selection?
        prevent = hotkey.callback.call(null, selection) == false
      )
    event.preventDefault() if prevent
    return !prevent
  )

_onTab = (range, shift = false) ->
  # Behavior according to Google Docs + Word
  # When tab on one line, regardless if shift is down, delete selection and insert a tab
  # When tab on multiple lines, indent each line if possible, outdent if shift is down
  lines = range.getLines()
  if lines.length > 1
    index = Scribe.Position.getIndex(lines[0].node)
    start = range.start.index + (if shift then -1 else 1)
    offsetChange = 0
    _.each(lines, (line) =>
      if !shift
        @editor.insertAt(index, '\t', {}, { source: 'user' })
        offsetChange += 1
      else if line.leaves.first.text[0] == '\t'
        @editor.deleteAt(index, 1, { source: 'user' })
        offsetChange -= 1
      else if line == lines[0]
        start = range.start.index
      index += line.length
    )
    end = range.end.index + offsetChange
    @editor.setSelection(new Scribe.Range(@editor, start, end))
  else
    range.deleteContents({ source: 'user' })
    range.insertContents(0, "\t", {}, { source: 'user' })
    @editor.setSelection(new Scribe.Range(@editor, range.start.index + 1, range.start.index + 1))


class Scribe.Keyboard
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

  @NAVIGATION: [@keys.UP, @keys.DOWN, @keys.LEFT, @keys.RIGHT]

  constructor: (@editor) ->
    @hotkeys = {}
    _initListeners.call(this)
    _initHotkeys.call(this)
    _initDeletes.call(this)

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
        indent = Math.min(Math.max(indent, Scribe.Line.MIN_INDENT), Scribe.Line.MAX_INDENT)
      else
        indent = false
      index = Position.getIndex(line.node, 0)
      @editor.formatAt(index, 0, format, indent)

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
    range.formatContents(format, !formats[format], { source: 'user' })


module.exports = Scribe
