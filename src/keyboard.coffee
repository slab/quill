class TandemKeyboard
  @KEYS:
    tab: 9
    enter: 13

  constructor: (@editor) ->
    @root = @editor.doc.root
    @root.addEventListener('keydown', (event) =>
      event ||= window.event
      switch event.which
        when TandemKeyboard.KEYS.tab
          selection = @editor.getSelection()
          intersection = selection.getAttributes()
          if intersection.bullet? || intersection.indent? || intersection.list?
            increment = if event.shiftKey == true then -1 else 1
            this.indent(selection, increment)
          else
            @editor.deleteAt(selection) if !selection.isCollapsed()
            selection = @editor.getSelection()
            @editor.insertAt(selection, "\t")
        else
          return true
      event.preventDefault()
      return false
    )

  indent: (selection, increment) ->
    lines = selection.getLines()
    applyIndent = (line, attr) =>
      indent = if _.isNumber(line.attributes[attr]) then line.attributes[attr] else (if line.attributes[attr] then 1 else 0)
      indent += increment
      indent = Math.min(Math.max(indent, Tandem.Constants.MIN_INDENT), Tandem.Constants.MAX_INDENT)
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



window.Tandem ||= {}
window.Tandem.Keyboard = TandemKeyboard
