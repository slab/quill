Scribe = require('./scribe')


class Scribe.Selection
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
    formats[name] = value
    @range.formats = formats
    @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, @range)
    this.setRange(new Scribe.Range(@editor, start, end))

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
        marker.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL) if marker?.classList?
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


module.exports = Scribe
