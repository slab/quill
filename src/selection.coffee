class ScribeSelection
  constructor: (@editor, cursorIndex) ->
    @destructors = []
    @range = null
    this.initListeners()
    @startIndex = @endIndex = cursorIndex

  destroy: ->
    _.each(@destructors, (fn) =>
      fn.call(this)
    )
    @destructors = null

  initListeners: ->
    checkUpdate = =>
      return if !@destructors?
      this.update()
    keyUpdate = (event) =>
      checkUpdate() if Scribe.Keyboard.KEYS.LEFT <= event.which and event.which <= Scribe.Keyboard.KEYS.DOWN
    @editor.root.addEventListener('keyup', keyUpdate)
    @editor.root.addEventListener('mouseup', checkUpdate)
    @destructors.push( =>
      @editor.root.removeEventListener('keyup', keyUpdate)
      @editor.root.removeEventListener('mouseup', checkUpdate)
    )

  format: (name, value) ->
    this.update()
    return unless @range
    start = @range.start.getIndex()
    end = @range.end.getIndex()
    formats = @range.getFormats()
    return unless start? and end?
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
    index = @range.start.getIndex()
    end = @range.end.getIndex()
    @editor.deleteAt(index, end - index) if index? && end?
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

  makeDelta: (index) ->
    deltas = [new JetInsert('|')]
    deltas.unshift(new JetRetain(0, index)) if index > 0
    deltas.push(new JetRetain(index, @editor.doc.length)) if index < @editor.doc.length
    return new JetDelta(@editor.doc.length, @editor.doc.length + 1, deltas)

  getInsertionPoint: (delta) ->
    index = 0
    _.all(delta.deltas, (delta) ->
      unless delta.text?
        index += (delta.end - delta.start)
        return true
      return false
    )
    return index

  preserve: (fn) ->
    if @range?
      [start, end] = this.save()
      delta = fn.call(null)
      start = JetSync.follows(delta, start, true)
      end = JetSync.follows(delta, end, false)
      this.restore(start, end)
    else
      fn.call(null)

  restore: (start, end) ->
    @startIndex = this.getInsertionPoint(start)
    @endIndex = this.getInsertionPoint(end)
    range = new Scribe.Range(@editor, @startIndex, @endIndex)
    this.setRange(range)

  setRange: (@range, silent = false) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    if @range?
      rangySelRange = @range.getRangy()
      rangySel.setSingleRange(rangySelRange)
      @startIndex = range.start.getIndex()
      @endIndex = range.end.getIndex()
    else
      rangySel.removeAllRanges()
      @startIndex = @endIndex = null
    @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, @range) unless silent

  setRangeNative: (nativeSel) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    range = rangy.createRangyRange(@editor.contentWindow)
    range.setStart(nativeSel.anchorNode, nativeSel.anchorOffset)
    range.setEnd(nativeSel.focusNode, nativeSel.focusOffset)
    rangySel.setSingleRange(range)

  save: ->
    startDelta = this.makeDelta(@startIndex)
    endDelta = this.makeDelta(@endIndex)
    return [startDelta, endDelta]

  update: (silent = false) ->
    range = this.getRange()
    unless (range == @range) || (@range?.equals(range))
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range
      @startIndex = range.start.getIndex()
      @endIndex = range.end.getIndex()



window.Scribe ||= {}
window.Scribe.Selection = ScribeSelection
