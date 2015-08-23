_         = require('lodash')
dom       = require('./lib/dom')
Parchment = require('parchment')


class Selection
  @Range: Range

  constructor: (@doc, @emitter) ->
    @root = @doc.domNode
    @range = new Range(0, 0)
    this.update(@emitter.constructor.sources.SILENT)

  checkFocus: ->
    return document.activeElement == @root

  focus: ->
    if @range?
      this.setRange(@range)
    else
      @root.focus()

  prepare: (format, value) ->
    return unless this.checkFocus()
    nativeRange = this._getNativeRange()
    console.log(format, value)

  getBounds: (index) ->
    pos = _.last(@doc.findPath(index))      # TODO inclusive
    return null unless pos?
    leafNode = pos.blot.domNode
    containerBounds = @root.parentNode.getBoundingClientRect()
    range = document.createRange()
    if pos.offset < pos.blot.getLength()
      range.setStart(leafNode, pos.offset)
      range.setEnd(leafNode, pos.offset + 1)
      side = 'left'
    else
      range.setStart(leafNode, pos.offset - 1)
      range.setEnd(leafNode, pos.offset)
      side = 'right'
    bounds = range.getBoundingClientRect()
    return {
      height: bounds.height
      left: bounds[side] - containerBounds.left
      top: bounds.top - containerBounds.top
    }

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

  onUpdate: (range) ->

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
    focus = this.checkFocus()
    range = this.getRange(true)
    @range = range
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
        # unless @doc.normalizer.whitelist.tags[node.tagName]?
        #   text = document.createTextNode('')
        #   node.appendChild(text)
        #   node = text
        return [node, 0]
      else
        node = node.lastChild
        if dom(node).isElement()
          if node.tagName == dom.DEFAULT_BREAK_TAG or dom.EMBED_TAGS[node.tagName]?
            return [node, 1]
          else
            offset = node.childNodes.length
        else
          return [node, dom(node).text().length]

  _getNativeRange: ->
    selection = document.getSelection()
    if selection?.rangeCount > 0
      range = selection.getRangeAt(0)
      if dom(range.startContainer).isAncestor(@root, true)
        if range.startContainer == range.endContainer or dom(range.endContainer).isAncestor(@root, true)
          return range
    return null

  _indexToPosition: (index) ->
    return [@root, 0] if @doc.children.length == 0
    path = @doc.findPath(index)
    pos = _.last(path)
    return this._decodePosition(pos.blot.domNode, pos.offset)

  _positionToIndex: (node, offset) ->
    offset = 0 if dom.isIE(10) and node.tagName == 'BR' and offset == 1
    [leafNode, offset] = this._encodePosition(node, offset)
    blot = Parchment.findBlot(leafNode)
    return 0 unless blot?   # Occurs on empty document
    while blot.domNode != @root
      offset += blot.offset()
      blot = blot.parent
    return offset

  _setNativeRange: (startNode, startOffset, endNode, endOffset) ->
    selection = document.getSelection()
    return unless selection
    if startNode?
      # Need to focus before setting or else in IE9/10 later focus will cause a set on 0th index on line div
      # to be set at 1st index
      @root.focus() unless this.checkFocus()
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
      @root.blur()
      # setRange(null) will fail to blur in IE10/11 on Travis+SauceLabs (but not local VMs)
      document.body.focus() if dom.isIE(11) and !dom.isIE(9)


class Range
  constructor: (@start, @end) ->

  shift: (index, length) ->
    [@start, @end] = _.map([@start, @end], (pos) ->
      return pos if index > pos
      if length >= 0
        return pos + length
      else
        return Math.max(index, pos + length)
    )

  isCollapsed: ->
    return @start == @end


module.exports = Selection
