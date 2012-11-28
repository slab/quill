class ScribeSelection
  constructor: (@editor) ->
    @destructors = []
    @range = null
    this.initListeners()

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
    @editor.doc.root.addEventListener('keyup', keyUpdate)
    @editor.doc.root.addEventListener('mouseup', checkUpdate)
    @destructors.push( =>
      @editor.doc.root.removeEventListener('keyup', keyUpdate)
      @editor.doc.root.removeEventListener('mouseup', checkUpdate)
    )

  applyAttribute: (attribute, value) ->
    this.update()
    return unless @range
    start = @range.start.getIndex()
    end = @range.end.getIndex()
    attributes = @range.getAttributes()
    return unless start? and end?
    if end > start
      @editor.applyAttribute(start, end - start, attribute, value)
    else if end == start
      # TODO can we remove DOM manipulation here? Could cause issues with rest of app
      @editor.doSilently( =>
        leafNode = @range.end.leafNode
        line = @editor.doc.findLine(leafNode)
        clone = Scribe.Utils.cloneAncestors(leafNode, line.node)
        lineOffset = Scribe.Position.getIndex(leafNode, 0, line.node) + @range.end.offset
        [left, right] = line.splitContents(lineOffset)
        line.node.insertBefore(clone, right)
        clone = Scribe.Utils.removeAttributeFromSubtree(clone, attribute)
        if clone == null
          clone = line.node.ownerDocument.createElement('span')
          line.node.insertBefore(clone, right)
        if value and Scribe.Utils.getAttributeDefault(attribute) != value
          attrNode = Scribe.Utils.createContainerForAttribute(clone.ownerDocument, attribute, value)
          clone = Scribe.Utils.wrap(attrNode, clone)
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
    attributes[attribute] = value
    @range.attributes = attributes
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

  preserve: (fn) ->
    if @range?
      savedSel = this.save()
      fn.call(null)
      this.restore(savedSel)
    else
      fn.call(null)

  restore: (savedSel) ->
    rangy.restoreSelection(savedSel, false)
    this.update(true)

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
    range = rangy.createRange(@editor.contentWindow)
    range.setStart(nativeSel.anchorNode, nativeSel.anchorOffset)
    range.setEnd(nativeSel.focusNode, nativeSel.focusOffset)
    rangySel.setSingleRange(range)

  save: ->
    savedSel = rangy.saveSelection(@editor.contentWindow)
    _.each(savedSel.rangeInfos, (rangeInfo) ->
      _.each([rangeInfo.startMarkerId, rangeInfo.endMarkerId, rangeInfo.markerId], (markerId) ->
        marker = rangeInfo.document.getElementById(markerId)
        marker.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL) if marker?.classList?
      )
    )
    return savedSel

  update: (silent = false) ->
    range = this.getRange()
    unless (range == @range) || (@range?.equals(range))
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range



window.Scribe ||= {}
window.Scribe.Selection = ScribeSelection
