Scribe = require('./scribe')


_initDeletes = ->
  _.each([Scribe.Keyboard.KEYS.DELETE, Scribe.Keyboard.KEYS.BACKSPACE], (key) =>
    this.addHotkey(key, =>
      # Prevent deleting if editor is already blank (browser quirk fix)
      return @editor.getLength() > 1
    )
  )

_initHotkeys = ->
  this.addHotkey(Scribe.Keyboard.HOTKEYS.INDENT, (range) =>
    lines = range.getLines()
    if lines.length > 1
      index = Scribe.Position.getIndex(lines[0].node)
      _.each(lines, (line) =>
        @editor.insertAt(index, "\t", {}, { source: 'user' })
        index += line.length
      )
    else
      range.deleteContents({ source: 'user' })
      range.insertContents(0, "\t", {}, { source: 'user' })
  )
  this.addHotkey(Scribe.Keyboard.HOTKEYS.BOLD, (range) =>
    this.toggleFormat(range, 'bold')
  )
  this.addHotkey(Scribe.Keyboard.HOTKEYS.ITALIC, (range) =>
    this.toggleFormat(range, 'italic')
  )
  this.addHotkey(Scribe.Keyboard.HOTKEYS.UNDERLINE, (range) =>
    this.toggleFormat(range, 'underline')
  )

_initListeners = ->
  @editor.root.addEventListener('keydown', (event) =>
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


class Scribe.Keyboard
  @KEYS:
    BACKSPACE : 8
    TAB       : 9
    ENTER     : 13
    LEFT      : 37
    UP        : 38
    RIGHT     : 39
    DOWN      : 40
    DELETE    : 46

  @HOTKEYS:
    BOLD:       { key: 'B',       meta: true }
    INDENT:     { key: @KEYS.TAB, shift: false }
    ITALIC:     { key: 'I',       meta: true }
    OUTDENT:    { key: @KEYS.TAB, shift: true }
    UNDERLINE:  { key: 'U',       meta: true }
    UNDO:       { key: 'Z',       meta: true, shift: false }
    REDO:       { key: 'Z',       meta: true, shift: true }

  @NAVIGATION: [@KEYS.UP, @KEYS.DOWN, @KEYS.LEFT, @KEYS.RIGHT]

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

  onIndentLine: (selection) ->
    return false if !selection?
    intersection = selection.getFormats()
    return intersection.bullet? || intersection.indent? || intersection.list?

  toggleFormat: (range, format) ->
    formats = range.getFormats()
    range.formatContents(format, !formats[format], { source: 'user' })


module.exports = Scribe
