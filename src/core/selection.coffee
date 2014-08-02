_          = require('lodash')
dom        = require('../lib/dom')
Leaf       = require('./leaf')
Normalizer = require('../lib/normalizer')
Range      = require('../lib/range')


class Selection
  constructor: (@doc, @iframe, @emitter) ->
    @document = @doc.root.ownerDocument
    @range = this.getRange()
    @nullDelay = false

  checkFocus: ->
    return false unless @document.activeElement == @doc.root
    if document.activeElement? and document.activeElement.tagName == 'IFRAME'
      return document.activeElement == @iframe
    return true

  getRange: ->
    return null unless this.checkFocus()
    nativeRange = this._getNativeRange()
    return null unless nativeRange?
    start = this._positionToIndex(nativeRange.startContainer, nativeRange.startOffset)
    if nativeRange.startContainer == nativeRange.endContainer and nativeRange.startOffset == nativeRange.endOffset
      end = start
    else
      end = this._positionToIndex(nativeRange.endContainer, nativeRange.endOffset)
    return new Range(Math.min(start, end), Math.max(start, end))

  preserve: (fn) ->
    nativeRange = this._getNativeRange()
    if nativeRange? and this.checkFocus()
      [startNode, startOffset] = this._encodePosition(nativeRange.startContainer, nativeRange.startOffset)
      [endNode, endOffset] = this._encodePosition(nativeRange.endContainer, nativeRange.endOffset)
      fn()
      [startNode, startOffset] = this._decodePosition(startNode, startOffset)
      [endNode, endOffset] = this._decodePosition(endNode, endOffset)
      this._setNativeRange(startNode, startOffset, endNode, endOffset)
    else
      fn()

  setRange: (range, source) ->
    if range?
      [startNode, startOffset] = this._indexToPosition(range.start)
      if range.isCollapsed()
        [endNode, endOffset] = [startNode, startOffset]
      else
        [endNode, endOffset] = this._indexToPosition(range.end)
      this._setNativeRange(startNode, startOffset, endNode, endOffset)
    else
      this._setNativeRange(null)
    this.update(source)

  shiftAfter: (index, length, fn) ->
    range = this.getRange()
    fn()
    if range?
      range.shift(index, length)
      this.setRange(range, 'silent')

  update: (source) ->
    range = this.getRange()
    emit = source != 'silent' and !Range.compare(range, @range)
    # If range changes to null, require two update cycles to update and emit
    if range == null and source =='user' and !@nullDelay
      @nullDelay = true
    else
      @nullDelay = false
      @range = range
      # Set range before emitting to prevent infinite loop if listeners call quill.getSelection()
      @emitter.emit(@emitter.constructor.events.SELECTION_CHANGE, range, source) if emit

  _decodePosition: (node, offset) ->
    if dom(node).isElement()
      childIndex = _.indexOf(dom(node.parentNode).childNodes(), node)
      offset += childIndex
      node = node.parentNode
    return [node, offset]

  _encodePosition: (node, offset) ->
    while true
      if dom(node).isTextNode() or node.tagName == dom.DEFAULT_BREAK_TAG or dom.EMBED_TAGS[node.tagName]?
        return [node, offset]
      else if offset < node.childNodes.length
        node = node.childNodes[offset]
        offset = 0
      else if node.childNodes.length == 0
        # TODO revisit fix for encoding edge case <p><em>|</em></p>
        unless Normalizer.TAGS[node.tagName]?
          text = node.ownerDocument.createTextNode('')
          node.appendChild(text)
          node = text
        return [node, 0]
      else
        node = node.lastChild
        if dom(node).isElement()
          if node.tagName == dom.DEFAULT_BREAK_TAG or dom.EMBED_TAGS[node.tagName]?
            return [node, 1]
          else
            offset = node.childNodes.length
        else
          return [node, dom(node).length()]

  _getNativeSelection: ->
    return if @document.getSelection? then @document.getSelection() else null

  _getNativeRange: ->
    selection = this._getNativeSelection()
    return if selection?.rangeCount > 0 then selection.getRangeAt(0) else null

  _indexToPosition: (index) ->
    return [@doc.root, 0] if @doc.lines.length == 0
    [leaf, offset] = @doc.findLeafAt(index, true)
    return this._decodePosition(leaf.node, offset)

  _positionToIndex: (node, offset) ->
    [leafNode, offset] = this._encodePosition(node, offset)
    line = @doc.findLine(leafNode)
    # TODO move to linked list
    return 0 unless line?   # Occurs on empty document
    leaf = line.findLeaf(leafNode)
    lineOffset = 0
    while line.prev?
      line = line.prev
      lineOffset += line.length
    return lineOffset unless leaf?
    leafOffset = 0
    while leaf.prev?
      leaf = leaf.prev
      leafOffset += leaf.length
    return lineOffset + leafOffset + offset

  _setNativeRange: (startNode, startOffset, endNode, endOffset) ->
    selection = this._getNativeSelection()
    return unless selection
    if startNode?
      @doc.root.focus()   # Some reason need to focus before removing ranges otherwise cannot set them
      nativeRange = this._getNativeRange()
      if !nativeRange? or startNode != nativeRange.startContainer or startOffset != nativeRange.startOffset or endNode != nativeRange.endContainer or endOffset != nativeRange.endOffset
        selection.removeAllRanges() if nativeRange?
        selection.removeAllRanges()
        nativeRange = @document.createRange()
        nativeRange.setStart(startNode, startOffset)
        nativeRange.setEnd(endNode, endOffset)
        selection.addRange(nativeRange)
        @doc.root.focus()   # IE11 needs refocus
    else
      selection.removeAllRanges()
      @doc.root.blur()


module.exports = Selection
