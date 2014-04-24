_     = require('lodash')
DOM   = require('./dom')
Leaf  = require('./leaf')
Range = require('./lib/range')


class Selection
  constructor: (@doc, @emitter) ->
    @document = @doc.root.ownerDocument
    @range = this.getRange()

  checkFocus: ->
    return @document.activeElement == @doc.root

  getRange: ->
    return null unless this.checkFocus()
    nativeRange = this._getNativeRange()
    return null unless nativeRange?
    start = this._positionToIndex(nativeRange.startContainer, nativeRange.startOffset)
    if nativeRange.endContainer != nativeRange.startContainer
      end = this._positionToIndex(nativeRange.endContainer, nativeRange.endOffset)
    else
      end = start - nativeRange.startOffset + nativeRange.endOffset
    return new Range(Math.min(start, end), Math.max(start, end))

  preserve: (fn) ->
    nativeRange = this._getNativeRange()
    if nativeRange?
      [startNode, startOffset] = this._normalizePosition(nativeRange.startContainer, nativeRange.startOffset)
      [endNode, endOffset] = this._normalizePosition(nativeRange.endContainer, nativeRange.endOffset)
      fn()
      this._setNativeRange(startNode, startOffset, endNode, endOffset)
    else
      fn()

  setRange: (range, silent) ->
    return this._setNativeRange(null) unless range?
    [startNode, startOffset] = this._indexToPosition(range.start)
    if range.isCollapsed()
      [endNode, endOffset] = [startNode, startOffset]
    else
      [endNode, endOffset] = this._indexToPosition(range.end)
    this._setNativeRange(startNode, startOffset, endNode, endOffset)
    this.update(silent)

  shiftAfter: (index, length, fn) ->
    range = this.getRange()
    fn()
    if range?
      range.shift(index, length)
      this.setRange(range)

  update: (silent) ->
    range = this.getRange()
    if !silent and !Range.compare(range, @range)
      @emitter.emit(@emitter.constructor.events.SELECTION_CHANGE, range)
    @range = range

  _getNativeRange: ->
    selection = @document.getSelection()
    return if selection?.rangeCount > 0 then selection.getRangeAt(0) else null

  _positionToIndex: (node, offset) ->
    [node, offset] = this._normalizePosition(node, offset)
    node = node.parentNode if DOM.isTextNode(node)
    line = @doc.findLine(node)
    # TODO move to linked list
    lineOffset = 0
    return 0 unless line?   # Occurs on empty document
    while line.prev?
      line = line.prev
      lineOffset += line.length + 1
    leaf = line.findLeaf(node)
    leaf = line.leaves.first unless leaf?
    leafOffset = 0
    while leaf.prev?
      leaf = leaf.prev
      leafOffset += leaf.length
    return lineOffset + leafOffset + offset

  _normalizePosition: (node, offset) ->
    while true
      if DOM.isTextNode(node) or node.tagName == DOM.DEFAULT_BREAK_TAG or DOM.EMBED_TAGS[node.tagName]?
        return [node, offset]
      else if offset < node.childNodes.length
        node = node.childNodes[offset]
        offset = 0
      else if node.childNodes.length == 0
        return [node, 0]
      else
        node = node.lastChild
        offset = 0

  _indexToPosition: (index) ->
    [line, lineOffset] = @doc.findLineAt(index)
    [leaf, leafOffset] = line.findLeafAt(lineOffset)
    unless leaf?
      leaf = line.leaves.first
      leafOffset = 0
    node = leaf.node
    if DOM.isTextNode(node.firstChild)
      node = node.firstChild
    else if node.tagName == DOM.DEFAULT_BREAK_TAG
      node = node.parentNode
      leafOffset = node.childNodes.length - 1   # Set right before break tag
    return [node, leafOffset]

  _setNativeRange: (startNode, startOffset, endNode, endOffset) ->
    selection = @document.getSelection()
    selection.removeAllRanges()
    if startNode?
      @doc.root.focus()
      nativeRange = @document.createRange()
      nativeRange.setStart(startNode, startOffset)
      nativeRange.setEnd(endNode, endOffset)
      selection.addRange(nativeRange)
    else
      @doc.root.blur()


module.exports = Selection
