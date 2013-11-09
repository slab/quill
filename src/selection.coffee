ScribeDOM       = require('./dom')
ScribeLine      = require('./line')
ScribeKeyboard  = require('./keyboard')
ScribePosition  = require('./position')
ScribeRange     = require('./range')
ScribeUtils     = require('./utils')


compareNativeRanges = (r1, r2) ->
  return true if r1 == r2           # Covers both is null case
  return false unless r1? and r2?   # If either is null they are not equal
  return r1.equals(r2)

# DOM Selection API says offset is child index of container, not number of characters like ScribePosition
normalizeNativePosition = (node, offset) ->
  if node?.nodeType == ScribeDOM.ELEMENT_NODE
    return [node, 0] unless node.firstChild?
    offset = Math.min(node.childNodes.length, offset)
    if offset < node.childNodes.length
      return normalizeNativePosition(node.childNodes[offset], 0)
    else
      if node.lastChild.nodeType == ScribeDOM.ELEMENT_NODE
        return normalizeNativePosition(node.lastChild, node.lastChild.childNodes.length)
      else
        return [node.lastChild, ScribeUtils.getNodeLength(node.lastChild)]
  return [node, offset]

normalizeNativeRange = (nativeRange) ->
  return null unless nativeRange?
  [startContainer, startOffset] = normalizeNativePosition(nativeRange.startContainer, nativeRange.startOffset)
  [endContainer, endOffset] = normalizeNativePosition(nativeRange.endContainer, nativeRange.endOffset)
  return {
    startContainer  : startContainer
    startOffset     : startOffset
    endContainer    : endContainer
    endOffset       : endOffset
    isBackwards     : nativeRange.isBackwards
  }

_nativeRangeToRange = (nativeRange) ->
  return null unless nativeRange?
  start = new ScribePosition(@editor, nativeRange.startContainer, nativeRange.startOffset)
  end = new ScribePosition(@editor, nativeRange.endContainer, nativeRange.endOffset)
  if start.index <= end.index 
    range = new ScribeRange(@editor, start, end)
    range.isBackwards = false
  else
    range = new ScribeRange(@editor, end, start)
    range.isBackwards = true
  range.isBackwards = true if nativeRange.isBackwards
  return range

_preserveWithIndex = (nativeRange, index, lengthAdded, fn) ->
  range = _nativeRangeToRange.call(this, nativeRange)
  [startIndex, endIndex] = _.map([range.start, range.end], (pos) ->
    if index >= pos.index
      return pos.index
    else
      return Math.max(pos.index + lengthAdded, index)
  )
  fn.call(null)
  this.setRange(new ScribeRange(@editor, startIndex, endIndex), true)

_preserveWithLine = (savedNativeRange, fn) ->
  savedData = _.map([
    { container: savedNativeRange.startContainer, offset: savedNativeRange.startOffset }
    { container: savedNativeRange.endContainer,   offset: savedNativeRange.endOffset }
  ], (position) =>
    lineNode = ScribeUtils.findAncestor(position.container, ScribeUtils.isLineNode) or @editor.root
    return {
      lineNode  : lineNode
      offset    : ScribePosition.getIndex(position.container, position.offset, lineNode)
      nextLine  : position.container.previousSibling?.tagName == 'BR'  # Track special case for Firefox
    }
  )
  fn.call(null)
  nativeRange = this.getNativeRange(true)
  if !_.isEqual(nativeRange, savedNativeRange)
    [start, end] = _.map(savedData, (savedDatum) =>
      if savedDatum.nextLine and savedDatum.lineNode.nextSibling?
        savedDatum.lineNode = savedDatum.lineNode.nextSibling
        savedDatum.offset = 0
      return new ScribePosition(@editor, savedDatum.lineNode, savedDatum.offset)
    )
    this.setRange(new ScribeRange(@editor, start, end), true)


class ScribeSelection
  constructor: (@editor) ->
    @range = null
    @mouseIsDown = @keyIsDown = @focusTransition = false
    @hasFocus = @editor.root.ownerDocument.activeElement == @editor.root
    ScribeDOM.addEventListener(@editor.root, 'keydown',   => @keyIsDown = true )
    ScribeDOM.addEventListener(@editor.root, 'keyup',     => @keyIsDown = false )
    ScribeDOM.addEventListener(@editor.root, 'mousedown', => @mouseIsDown = true )
    ScribeDOM.addEventListener(@editor.root, 'mouseup',   => @mouseIsDown = false )
    rangy.init()
    if @editor.renderer.options.iframe
      @nativeSelection = rangy.getIframeSelection(@editor.renderer.iframe) if @editor.renderer.iframe.parentNode?
    else
      @nativeSelection = rangy.getSelection()
    this.setRange(null)

  getDimensions: ->
    return null unless @range?
    nativeRange = @range.nativeRange or @range.textRange
    return nativeRange.getBoundingClientRect()
    
  getNativeRange: (normalize = false) ->
    return null unless @nativeSelection
    @nativeSelection.refresh()
    # Editor needs focus for us to consider valid range
    return null unless @nativeSelection?.rangeCount > 0
    range = @nativeSelection.getRangeAt(0)
    # Selection elements needs to be within editor root
    return null unless rangy.dom.isAncestorOf(@editor.root, range.startContainer, true) and rangy.dom.isAncestorOf(@editor.root, range.endContainer, true)
    range = normalizeNativeRange(range) if normalize
    range.isBackwards = true if @nativeSelection.isBackwards()
    return range

  getRange: ->
    nativeRange = this.getNativeRange(true)
    return if nativeRange? then _nativeRangeToRange.call(this, nativeRange) else null

  preserve: (index, lengthAdded, fn) ->
    fn = index if _.isFunction(index)
    nativeRange = this.getNativeRange(true)
    if nativeRange?
      if _.isFunction(index)
        _preserveWithLine.call(this, nativeRange, index)
      else
        _preserveWithIndex.call(this, nativeRange, index, lengthAdded, fn)
    else
      fn.call(null)

  setRange: (range, silent = false) ->
    return unless @nativeSelection?
    @nativeSelection.removeAllRanges() if @editor.renderer.checkFocus()
    if range?
      nativeRange = rangy.createRangyRange()
      _.each([range.start, range.end], (pos, i) ->
        [node, offset] = ScribeUtils.findDeepestNode(pos.leafNode, pos.offset)
        offset = Math.min(ScribeDOM.getText(node).length, offset)   # Should only occur at end of document
        if node.tagName == 'BR'
          node = node.parentNode if node.tagName == "BR"            # Firefox does not split BR, IE cannot select BR
          offset = 1 if ScribeUtils.isIE()
        fn = if i == 0 then 'setStart' else 'setEnd'
        nativeRange[fn].call(nativeRange, node, offset)
      )
      @nativeSelection.addRange(nativeRange, range.isBackwards)
      @range = this.getNativeRange(false)
    else
      @range = null
    @editor.emit(@editor.constructor.events.SELECTION_CHANGE, range) unless silent

  update: (silent = false) ->
    return if (@mouseIsDown or @keyIsDown or @focusTransition) and !silent
    hasFocus = @editor.renderer.checkFocus()
    if hasFocus != @hasFocus
      @hasFocus = hasFocus
      @editor.emit(@editor.constructor.events.FOCUS_CHANGE, @hasFocus) unless silent
      clearTimeout(@focusTransition)
      # In IE8 we actually lose the selection if we lose focus so delay updating the selection if it's temporary, ex. clicking on a toolbar button
      @focusTransition = setTimeout( =>
        @focusTransition = false
      , @editor.options.pollInterval * 1.5)
      return unless @hasFocus
    nativeRange = this.getNativeRange(false)
    unless compareNativeRanges(nativeRange, @range)
      range = _nativeRangeToRange.call(this, normalizeNativeRange(nativeRange))
      if (nativeRange? and !@range?) or !nativeRange?
        this.setRange(range, silent)
      else
        @range = nativeRange
        @editor.emit(@editor.constructor.events.SELECTION_CHANGE, range) unless silent


module.exports = ScribeSelection
