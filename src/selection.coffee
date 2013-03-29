Scribe = require('./scribe')


_getMarkers = (savedSel) ->
  markers = _.map(savedSel.rangeInfos, (rangeInfo) ->
    return _.map([rangeInfo.startMarkerId, rangeInfo.endMarkerId, rangeInfo.markerId], (markerId) ->
      marker = rangeInfo.document.getElementById(markerId)
      return if marker? and marker.nodeType == marker.ELEMENT_NODE then marker else null
    )
  )
  return _.compact(_.flatten(markers))


class Scribe.Selection
  constructor: (@editor) ->
    @range = null
    this.initListeners()

  initListeners: ->
    checkUpdate = =>
      this.update() if @editor.root.isContentEditable
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
    markers = _getMarkers(savedSel)
    parents = _.map(markers, (marker) ->
      return marker.parentNode
    )
    rangy.restoreSelection(savedSel, false)
    _.each(parents, (parentNode) ->
      parentNode.normalize()
    )
    this.update(true)

  save: ->
    savedSel = rangy.saveSelection(@editor.contentWindow)
    markers = _getMarkers(savedSel)
    _.each(markers, (marker) ->
      marker.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL) 
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
    unless range == @range or @range?.equals(range)
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range


module.exports = Scribe
