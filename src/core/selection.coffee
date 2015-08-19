_          = require('lodash')
dom        = require('../lib/dom')
Leaf       = require('./leaf')
Normalizer = require('./normalizer')
Range      = require('../lib/range')


class Selection
  constructor: (@doc, @emitter) ->
    @focus = false
    @range = new Range(0, 0)
    @nullDelay = false
    this.update('silent')

  checkFocus: ->
    return document.activeElement == @doc.root

  getRange: (ignoreFocus = false) ->
    if this.checkFocus()
      nativeRange = this._getNativeRange()
      return null unless nativeRange?
      start = this._positionToIndex(nativeRange.startContainer, nativeRange.startOffset)
      if nativeRange.startContainer == nativeRange.endContainer and nativeRange.startOffset == nativeRange.endOffset
        end = start
      else
        end = this._positionToIndex(nativeRange.endContainer, nativeRange.endOffset)
      return new Range(Math.min(start, end), Math.max(start, end)) # Handle backwards ranges
    else if ignoreFocus
      return @range
    else
      return null

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

  scrollIntoView: () ->
    return unless @range
    editor = @emitter.editor
    startBounds = editor.getBounds(@range.start)
    endBounds = if @range.isCollapsed() then startBounds else editor.getBounds(@range.end)
    containerBounds = editor.root.parentNode.getBoundingClientRect()
    containerHeight = containerBounds.bottom - containerBounds.top
    if containerHeight < endBounds.top + endBounds.height
      [line, offset] = editor.doc.findLineAt(@range.end)
      line.node.scrollIntoView(false)
    else if startBounds.top < 0
      [line, offset] = editor.doc.findLineAt(@range.start)
      line.node.scrollIntoView()

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
    focus = this.checkFocus()
    range = this.getRange(true)
    emit = source != 'silent' and (!Range.compare(range, @range) or focus != @focus)
    toEmit = if focus then range else null
    # If range changes to null, require two update cycles to update and emit
    if toEmit == null and source == 'user' and !@nullDelay
      @nullDelay = true
    else
      @nullDelay = false
      @range = range
      @focus = focus
      # Set range before emitting to prevent infinite loop if listeners call quill.getSelection()
      @emitter.emit(@emitter.constructor.events.SELECTION_CHANGE, toEmit, source) if emit

  _decodePosition: (node, offset) ->
    if dom(node).isElement()
      childIndex = dom(node.parentNode).childNodes().indexOf(node)
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
        unless @doc.normalizer.whitelist.tags[node.tagName]?
          text = document.createTextNode('')
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

  _getNativeRange: ->
    selection = document.getSelection()
    if selection?.rangeCount > 0
      range = selection.getRangeAt(0)
      if dom(range.startContainer).isAncestor(@doc.root, true)
        if range.startContainer == range.endContainer or dom(range.endContainer).isAncestor(@doc.root, true)
          return range
    return null

  _indexToPosition: (index) ->
    return [@doc.root, 0] if @doc.lines.length == 0
    [leaf, offset] = @doc.findLeafAt(index, true)
    return this._decodePosition(leaf.node, offset)

  _positionToIndex: (node, offset) ->
    offset = 0 if dom.isIE(10) and node.tagName == 'BR' and offset == 1
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
    selection = document.getSelection()
    return unless selection
    if startNode?
      # Need to focus before setting or else in IE9/10 later focus will cause a set on 0th index on line div
      # to be set at 1st index
      @doc.root.focus() unless this.checkFocus()
      nativeRange = this._getNativeRange()
      if !nativeRange? or startNode != nativeRange.startContainer or startOffset != nativeRange.startOffset or endNode != nativeRange.endContainer or endOffset != nativeRange.endOffset
        # IE9 requires removeAllRanges() regardless of value of
        # nativeRange or else formatting from toolbar does not work
        selection.removeAllRanges()
        nativeRange = document.createRange()
        nativeRange.setStart(startNode, startOffset)
        nativeRange.setEnd(endNode, endOffset)
        selection.addRange(nativeRange)
    else
      selection.removeAllRanges()
      @doc.root.blur()
      # setRange(null) will fail to blur in IE10/11 on Travis+SauceLabs (but not local VMs)
      document.body.focus() if dom.isIE(11) and !dom.isIE(9)


module.exports = Selection
