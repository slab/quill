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
  @SAVED_CLASS = 'saved-selection'

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

  format: (name, value, external = true) ->
    this.update()
    return unless @range
    start = @range.start.index
    end = @range.end.index
    formats = @range.getFormats()
    @editor.formatAt(start, end - start, name, value, external) if end > start
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
    this.update(true)
    if @range?
      positionNodes = this.save()
      fn.call(null)
      this.restore(positionNodes)
    else
      fn.call(null)

  restore: (positionNodes) ->
    indexes = []
    _.each(positionNodes, (node) ->
      return console.warn "Saved position deleted", node unless node.parentNode?
      indexes.push(Scribe.Position.getIndex(node, 0))
      parentNode = node.parentNode
      parentNode.removeChild(node)
      parentNode.normalize()
    )
    return if indexes.length < 1
    indexes.push(indexes[0]) if indexes.length == 1
    range = new Scribe.Range(@editor, indexes[0], indexes[1])
    this.setRange(range, true)
    this.update(true)

  save: ->
    markers = @editor.root.querySelectorAll(".#{Scribe.Selection.SAVED_CLASS}")
    if markers.length > 0
      console.warn "Double selection save", markers
      _.each(markers, (marker) -> marker.parentNode.removeChild(marker))
    return _.map([@range.start, @range.end], (position) ->
      [textNode, offset] = Scribe.DOM.findDeepestNode(position.leafNode, position.offset)
      span = position.leafNode.ownerDocument.createElement('span')
      span.classList.add(Scribe.Selection.SAVED_CLASS)
      span.classList.add(Scribe.DOM.EXTERNAL_CLASS)
      if textNode.nodeType == textNode.TEXT_NODE
        [left, right] = Scribe.DOM.splitNode(textNode, offset, true)
        position.leafNode.insertBefore(span, right)
      else
        if offset == 0
          position.leafNode.parentNode.insertBefore(span, textNode)
        else
          console.warn 'Saving selection at offset greater than line length' if offset > 1
          position.leafNode.parentNode.insertBefore(span, textNode.nextSibling)
      return span
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
    unless range == @range or @range?.equals(range)
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range


module.exports = Scribe
