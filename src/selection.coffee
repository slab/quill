class ScribeSelection
  constructor: (@editor) ->
    @range = null
    this.initListeners()

  initListeners: ->
    checkUpdate = =>
      this.update()
    keyUpdate = (event) =>
      checkUpdate() if Scribe.Keyboard.KEYS.LEFT <= event.which and event.which <= Scribe.Keyboard.KEYS.DOWN
    @editor.root.addEventListener('keyup', keyUpdate)
    @editor.root.addEventListener('mouseup', checkUpdate)

  format: (name, value) ->
    this.update()
    return unless @range
    start = @range.start.index
    end = @range.end.index
    formats = @range.getFormats()
    if end > start
      @editor.formatAt(start, end - start, name, value)
    else if end == start
      # TODO can we remove DOM manipulation here? Could cause issues with rest of app
      @editor.doSilently( =>
        leafNode = @range.end.leafNode
        line = @editor.doc.findLine(leafNode)
        clone = Scribe.Utils.cloneAncestors(leafNode, line.node)
        lineOffset = Scribe.Position.getIndex(leafNode, 0, line.node) + @range.end.offset
        [left, right] = line.splitContents(lineOffset)
        line.node.insertBefore(clone, right)
        clone = Scribe.Utils.removeFormatFromSubtree(clone, name)
        if clone == null
          clone = line.node.ownerDocument.createElement('span')
          line.node.insertBefore(clone, right)
        if value and Scribe.Utils.getFormatDefault(name) != value
          formatNode = Scribe.Utils.createContainerForFormat(clone.ownerDocument, name, value)
          clone = Scribe.Utils.wrap(formatNode, clone)
        while clone.firstChild?
          clone = clone.firstChild
        clone.innerHTML = Scribe.Constants.NOBREAK_SPACE
        this.setRangeNative(
          anchorNode    : clone
          anchorOffset  : 1
          focusNode     : clone
          focusOffset   : 1
        )
      )
    formats[name] = value
    @range.formats = formats
    @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, @range)

  deleteRange: ->
    this.update()
    return false if @range.isCollapsed()
    @editor.deleteAt(@range.start.index, @range.end.index - @range.start.index)
    this.update()
    return @range

  getNative: ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    selection = window.getSelection()
    return null unless rangySel.anchorNode? && rangySel.focusNode?
    if !rangySel.isBackwards()
      [anchorNode, anchorOffset, focusNode, focusOffset] = [rangySel.anchorNode, rangySel.anchorOffset, rangySel.focusNode, rangySel.focusOffset]
    else
      [focusNode, focusOffset, anchorNode, anchorOffset] = [rangySel.anchorNode, rangySel.anchorOffset, rangySel.focusNode, rangySel.focusOffset]
    return {
      anchorNode    : anchorNode
      anchorOffset  : anchorOffset
      focusNode     : focusNode
      focusOffset   : focusOffset
    }

  getRange: ->
    nativeSel = this.getNative()
    return null unless nativeSel?
    start = new Scribe.Position(@editor, nativeSel.anchorNode, nativeSel.anchorOffset)
    end = new Scribe.Position(@editor, nativeSel.focusNode, nativeSel.focusOffset)
    return new Scribe.Range(@editor, start, end)

  preserve: (fn) ->
    if @range?
      [start, end] = this.save()
      delta = fn.call(null)
      start = JetSync.follows(delta, start, true)
      end = JetSync.follows(delta, end, false) if end?
      this.restore(start, end)
    else
      fn.call(null)

  restore: (start, end) ->
    [startIndex, endIndex] = _.map([start, end], (delta) ->
      return null unless delta?
      index = 0
      _.all(delta.deltas, (delta) ->
        unless delta.text?
          index += (delta.end - delta.start)
          return true
        return false
      )
      return index
    )
    endIndex = startIndex unless endIndex?
    range = new Scribe.Range(@editor, startIndex, endIndex)
    this.setRange(range)

  save: ->
    return null unless @range?
    indexes = [@range.start.index]
    indexes.push(@range.end.index) unless @range.isCollapsed()
    return _.map(indexes, (index) =>
      deltas = [new JetInsert('|')]
      deltas.unshift(new JetRetain(0, index)) if index > 0
      deltas.push(new JetRetain(index, @editor.doc.length)) if index < @editor.doc.length
      return new JetDelta(@editor.doc.length, @editor.doc.length + 1, deltas)
    )

  setRange: (@range, silent = false) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    if @range?
      rangySelRange = @range.getRangy()
      rangySel.setSingleRange(rangySelRange)
    else
      rangySel.removeAllRanges()
    @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, @range) unless silent

  setRangeNative: (nativeSel) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    range = rangy.createRangyRange(@editor.contentWindow)
    range.setStart(nativeSel.anchorNode, nativeSel.anchorOffset)
    range.setEnd(nativeSel.focusNode, nativeSel.focusOffset)
    rangySel.setSingleRange(range)

  update: (silent = false) ->
    range = this.getRange()
    unless (range == @range) || (@range?.equals(range))
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range



window.Scribe ||= {}
window.Scribe.Selection = ScribeSelection
