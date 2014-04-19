_     = require('lodash')
DOM   = require('./dom')
Leaf  = require('./leaf')
Range = require('./range')

compareRanges = (r1, r2) ->
  return true if r1 == r2           # Covers both is null case
  return false unless r1? and r2?   # If either is null they are not equal
  return r1.equals(r2)

findTerminal = (node, offset) ->
  while !DOM.isTextNode(node) and node.tagName == DOM.DEFAULT_BREAK_TAG
    node = node.childNodes[offset]
    offset = 0
  return [node, offset]

_getIndex = (node, offset) ->
  [node, offset] = findTerminal(node, offset)
  node = node.parentNode if DOM.isTextNode(node)
  line = @doc.findLine(node)
  # TODO move to linked list
  lineOffset = 0
  while line.prev?
    line = line.prev
    lineOffset += line.length + 1
  leaf = line.findLeaf(node)
  leafOffset = 0
  while leaf.prev?
    leaf = leaf.prev
    leafOffset += leaf.length
  return lineOffset + leafOffset + offset

_getPosition = (index) ->
  [line, lineOffset] = @doc.findLineAt(index)
  [leaf, leafOffset] = line.findLeafAt(lineOffset)
  node = leaf.node
  node = node.firstChild if node.firstChild?
  return [node, leafOffset]


class Selection
  constructor: (@doc, @emitter) ->
    @document = @doc.root.ownerDocument
    @range = this.getRange()

  getNativeRange: ->
    selection = @document.getSelection()
    return if selection.rangeCount <= 0 then null else selection.getRangeAt(0)

  getRange: ->
    nativeRange = this.getNativeRange()
    return null unless nativeRange?
    start = _getIndex.call(this, nativeRange.startContainer, nativeRange.startOffset)
    if nativeRange.endContainer != nativeRange.startContainer
      end = _getIndex.call(this, nativeRange.endContainer, nativeRange.endOffset)
    else
      end = start - nativeRange.startOffset + nativeRange.endOffset
    return new Range(@doc, Math.min(start, end), Math.max(start, end))

  preserve: (fn) ->
    nativeRange = this.getNativeRange()
    if nativeRange?
      [startNode, startOffset] = findTerminal(nativeRange.startContainer, nativeRange.startOffset)
      [endNode, endOffset] = findTerminal(nativeRange.endContainer, nativeRange.endOffset)
      fn()
      this.setNativeRange(startNode, startOffset, endNode, endOffset)
    else
      fn()

  setNativeRange: (startNode, startOffset, endNode, endOffset) ->
    selection = @document.getSelection()
    selection.removeAllRanges()
    if startNode?
      nativeRange = @document.createRange()
      nativeRange.setStart(startNode, startOffset)
      nativeRange.setEnd(endNode, endOffset)
      selection.addRange(nativeRange)

  setRange: (range, silent) ->
    return this.setNativeRange(null) unless range?
    [startNode, startOffset] = _getPosition.call(this, range.start)
    if range.isCollapsed()
      [endNode, endOffset] = [startNode, startOffset]
    else
      [endNode, endOffset] = _getPosition.call(this, range.end)
    this.setNativeRange(startNode, startOffset, endNode, endOffset)
    this.update(silent)

  shiftAfter: (index, length, fn) ->
    range = this.getRange()
    fn()
    if range?
      range.shift(index, length)
      this.setRange(range)

  update: (silent) ->
    range = this.getRange()
    if !silent and !compareRanges(range, @range)
      @emitter.emit(@emitter.constructor.events.SELECTION_CHANGE, range)
    @range = range


module.exports = Selection
