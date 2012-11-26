class TandemKeyboard
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
    BOLD:       { key: 'B', meta: true }
    ITALIC:     { key: 'I', meta: true }
    UNDERLINE:  { key: 'U', meta: true }
    UNDO:       { key: 'Z', meta: true, shift: false }
    REDO:       { key: 'Z', meta: true, shift: true }

  constructor: (@editor) ->
    @root = @editor.doc.root
    @root.addEventListener('keydown', (event) =>
      event ||= window.event
      if @hotkeys[event.which]?
        _.each(@hotkeys[event.which], (hotkey) ->
          return if hotkey.meta? and event.metaKey != hotkey.meta
          return if hotkey.shift? and event.shiftKey != hotkey.shift
          hotkey.callback.call(null)
        )
        event.preventDefault()
        return false
      return true
    )
    @hotkeys = {}
    this.initHotkeys()

  initHotkeys: ->
    this.addHotkey(TandemKeyboard.KEYS.TAB, =>
      @editor.selection.deleteRange()
      this.insertText("\t")
    )
    this.addHotkey(TandemKeyboard.KEYS.ENTER, =>
      @editor.selection.deleteRange()
      this.insertText("\n")
    )
    this.addHotkey(TandemKeyboard.KEYS.BACKSPACE, =>
      unless @editor.selection.deleteRange()
        index = selection.start.getIndex()
        @editor.deleteAt(index - 1, 1) if index? && index > 0
    )
    this.addHotkey(TandemKeyboard.KEYS.DELETE, =>
      unless @editor.selection.deleteRange()
        index = selection.start.getIndex()
        @editor.deleteAt(index, 1) if index? && index < @editor.doc.length - 1
    )

  addHotkey: (hotkey, callback) ->
    hotkey = if _.isObject(hotkey) then _.clone(hotkey) else { key: hotkey }
    hotkey.key = hotkey.key.toUpperCase().charCodeAt(0) if _.isString(hotkey.key)
    hotkey.callback = callback
    @hotkeys[hotkey.key] = [] unless @hotkeys[hotkey.key]?
    @hotkeys[hotkey.key].push(hotkey)

  indent: (selection, increment) ->
    lines = selection.getLines()
    applyIndent = (line, attr) =>
      if increment
        indent = if _.isNumber(line.attributes[attr]) then line.attributes[attr] else (if line.attributes[attr] then 1 else 0)
        indent += increment
        indent = Math.min(Math.max(indent, Tandem.Constants.MIN_INDENT), Tandem.Constants.MAX_INDENT)
      else
        indent = false
      index = Tandem.Position.getIndex(line.node, 0)
      @editor.applyAttribute(index, 0, attr, indent)

    _.each(lines, (line) =>
      if line.attributes.bullet?
        applyIndent(line, 'bullet')
      else if line.attributes.list?
        applyIndent(line, 'list')
      else
        applyIndent(line, 'indent')
      @editor.doc.updateDirty()
    )

  onIndentLine: (selection) ->
    return false if !selection?
    intersection = selection.getAttributes()
    return intersection.bullet? || intersection.indent? || intersection.list?

  insertText: (text) ->
    selection = @editor.getSelection()
    index = selection.start.getIndex()
    if index?
      @editor.insertAt(index, text)
      # Make sure selection is after our text
      range = new Tandem.Range(@editor, index + text.length, index + text.length)
      @editor.setSelection(range)


window.Tandem ||= {}
window.Tandem.Keyboard = TandemKeyboard
