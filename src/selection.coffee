class TandemSelection
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
      checkUpdate() if Tandem.Keyboard.KEYS.LEFT <= event.which and event.which <= Tandem.Keyboard.KEYS.DOWN
    @editor.doc.root.addEventListener('keyup', keyUpdate)
    @editor.doc.root.addEventListener('mouseup', checkUpdate)
    @destructors.push( =>
      @editor.doc.root.removeEventListener('keyup', keyUpdate)
      @editor.doc.root.removeEventListener('mouseup', checkUpdate)
    )

  applyAttribute: (attribute, value) ->
    return unless @range
    start = @range.start.getIndex()
    end = @range.end.getIndex()
    return unless start? and end?
    if end > start
      @editor.applyAttribute(start, end - start, attribute, value)
    else if end == start
      # TODO can we remove DOM manipulation here? Could cause issues with rest of app
      # Split content, then copy it
      @editor.doSilently( =>
        leaf = @range.end.getLeaf()
        clone = Tandem.Utils.cloneAncestors(leaf.node, leaf.line.node)
        [left, right] = leaf.line.splitContents(leaf.getLineOffset() + @range.end.offset)
        leaf.line.node.insertBefore(clone, right)
        clone = Tandem.Utils.removeAttributeFromSubtree(clone, attribute)
        if clone == null
          clone = leaf.node.ownerDocument.createElement('span')
          leaf.line.node.insertBefore(clone, right)
        if value and Tandem.Utils.getAttributeDefault(attribute) != value
          attrNode = Tandem.Utils.createContainerForAttribute(clone.ownerDocument, attribute, value)
          clone = Tandem.Utils.wrap(attrNode, clone)
        while clone.firstChild?
          clone = clone.firstChild
        clone.innerHTML = Tandem.Constants.NOBREAK_SPACE
        this.setRangeNative(
          anchorNode    : clone
          anchorOffset  : 1
          focusNode     : clone
          focusOffset   : 1
        )
      )

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
    start = new Tandem.Position(@editor, nativeSel.anchorNode, nativeSel.anchorOffset)
    end = new Tandem.Position(@editor, nativeSel.focusNode, nativeSel.focusOffset)
    return new Tandem.Range(@editor, start, end)

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

  save: ->
    savedSel = rangy.saveSelection(@editor.contentWindow)
    _.each(savedSel.rangeInfos, (rangeInfo) ->
      _.each([rangeInfo.startMarkerId, rangeInfo.endMarkerId, rangeInfo.markerId], (markerId) ->
        marker = rangeInfo.document.getElementById(markerId)
        marker.classList.add(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL) if marker?.classList?
      )
    )
    return savedSel

  setRange: (@range, silent = false) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    if @range?
      rangySelRange = @range.getRangy()
      rangySel.setSingleRange(rangySelRange)
    else
      rangySel.removeAllRanges()
    @editor.emit(Tandem.Editor.events.SELECTION_CHANGE, @range) unless silent

  setRangeNative: (nativeSel) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    range = rangy.createRange(@editor.contentWindow)
    range.setStart(nativeSel.anchorNode, nativeSel.anchorOffset)
    range.setEnd(nativeSel.focusNode, nativeSel.focusOffset)
    rangySel.setSingleRange(range)

  update: (silent = false) ->
    range = this.getRange()
    unless (range == @range) || (@range?.equals(range))
      @editor.emit(Tandem.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range



window.Tandem ||= {}
window.Tandem.Selection = TandemSelection
