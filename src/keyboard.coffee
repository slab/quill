class TandemKeyboard
  @KEYS:
    BACKSPACE: 8
    TAB: 9
    ENTER: 13
    LEFT: 37
    UP: 38
    RIGHT: 39
    DOWN: 40
    Z: 90

  constructor: (@editor) ->
    @root = @editor.doc.root
    @root.addEventListener('keydown', (event) =>
      event ||= window.event
      selection = @editor.getSelection()
      switch event.which
        when TandemKeyboard.KEYS.TAB
          if this.onIndentLine(selection)
            increment = if event.shiftKey == true then -1 else 1
            this.indent(selection, increment)
          else
            this.insertText("\t")
        when TandemKeyboard.KEYS.ENTER
          this.insertText("\n")
        when TandemKeyboard.KEYS.BACKSPACE
          if selection.isCollapsed() && this.onIndentLine(selection) && selection.start.offset == 0
            attrs = selection.getAttributes()
            if (attrs.list? && attrs.list > 1) || (attrs.bullet? && attrs.bullet > 1) || (attrs.indent? && attrs.indent > 1)
              this.indent(selection, -1)
            else
              this.indent(selection, false)
          else
            return true
        else
          return true
      event.preventDefault()
      return false
    )

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
    unless selection.isCollapsed()
      end = selection.end.getIndex()
      @editor.deleteAt(index, end - index) if end?
    @editor.insertAt(index, text)
    # Make sure selection is after our text
    range = new Tandem.Range(@editor, index + text.length, index + text.length)
    @editor.setSelection(range)


window.Tandem ||= {}
window.Tandem.Keyboard = TandemKeyboard
