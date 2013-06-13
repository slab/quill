Scribe = require('./scribe')


class Scribe.Selection
  @SAVED_CLASS = 'saved-selection'

  constructor: (@editor) ->
    @range = null
    @nativeSelection = @editor.contentWindow.getSelection()
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

  getRange: ->
    return null unless @nativeSelection.rangeCount > 0
    nativeRange = @nativeSelection.getRangeAt(0)
    start = new Scribe.Position(@editor, nativeRange.startContainer, nativeRange.startOffset)
    end = new Scribe.Position(@editor, nativeRange.endContainer, nativeRange.endOffset)
    if nativeRange.compareBoundaryPoints(Range.START_TO_END, nativeRange) > -1
      return new Scribe.Range(@editor, start, end)
    else
      return new Scribe.Range(@editor, end, start)

  preserve: (fn) ->
    this.update(true)
    if @range?
      markers = this.save()
      fn.call(null)
      this.restore(markers)
    else
      fn.call(null)

  restore: (markers) ->
    indexes = []
    _.each(markers, (node) ->
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
          textNode.parentNode.insertBefore(span, textNode)
        else
          console.warn 'Saving selection at offset greater than line length' if offset > 1
          textNode.parentNode.insertBefore(span, textNode.nextSibling)
      return span
    )

  setRange: (@range, silent = false) ->
    @nativeSelection.removeAllRanges()
    if @range?
      nativeRange = @editor.root.ownerDocument.createRange()
      [startNode, startOffset] = Scribe.DOM.findDeepestNode(@range.start.leafNode, @range.start.offset)
      nativeRange.setStart(startNode, startOffset)
      [endNode, endOffset] = Scribe.DOM.findDeepestNode(@range.end.leafNode, @range.end.offset)
      nativeRange.setEnd(endNode, endOffset)
      @nativeSelection.addRange(nativeRange)
    @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, @range) unless silent

  update: (silent = false) ->
    range = this.getRange()
    unless range == @range or @range?.equals(range)
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range


module.exports = Scribe
