ScribeDOM       = require('./dom')
ScribeLine      = require('./line')
ScribeKeyboard  = require('./keyboard')
ScribePosition  = require('./position')
ScribeRange     = require('./range')
ScribeUtils     = require('./utils')


compareRanges = (range1, range2) ->
  return true if range1 == null and range2 == null
  return false if range1 == null or range2 == null
  startContainer1 = range1.startContainer ? range1.start.leafNode
  startContainer2 = range2.startContainer ? range2.start.leafNode
  endContainer1 = range1.endContainer ? range1.end.leafNode
  endContainer2 = range2.endContainer ? range2.end.leafNode
  startOffset1 = range1.startOffset ? range1.start.offset
  startOffset2 = range2.startOffset ? range2.start.offset
  endOffset1 = range1.endOffset ? range1.end.offset
  endOffset2 = range2.endOffset ? range2.end.offset
  return startContainer1 == startContainer2 and endContainer1 == endContainer2 and startOffset1 == startOffset2 and endOffset1 == endOffset2

# DOM Selection API says offset is child index of container, not number of characters like ScribePosition
normalizeNativePosition = (node, offset) ->
  if node?.nodeType == ScribeDOM.ELEMENT_NODE
    if offset == 0
      node = node.firstChild if node.firstChild?
    else
      node = node.childNodes[node.childNodes.length-1]
      offset = ScribeDOM.getText(node).length
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
  }

_nativeRangeToRange = (nativeRange) ->
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
    this.initListeners()
    @editor.renderer.runWhenLoaded( =>
      rangy.init()
      @nativeSelection = rangy.getIframeSelection(@editor.renderer.iframe) if @editor.renderer.iframe.parentNode?
      this.setRange(null)
    )

  initListeners: ->
    checkUpdate = =>
      this.update() if @editor.root.isContentEditable
    ScribeDOM.addEventListener(@editor.root, 'mouseup', checkUpdate)
    ScribeDOM.addEventListener(@editor.root, 'mouseout', checkUpdate)
    _.each(ScribeKeyboard.NAVIGATION.concat([ScribeKeyboard.hotkeys.SELECT_ALL]), (key) =>
      @editor.keyboard.addHotkey(key, =>
        _.defer(checkUpdate)          # Need to defer to let selection update from hotkey
      )
    )
    setInterval(checkUpdate, 100)

  getDimensions: ->
    rangyRange = this.getNativeRange(false)
    return null unless rangyRange?
    nativeRange = rangyRange.nativeRange or rangyRange.textRange
    return nativeRange.getBoundingClientRect()
    
  getNativeRange: (normalize = false) ->
    return null unless @nativeSelection
    @nativeSelection.refresh()
    range = if @nativeSelection?.rangeCount > 0 then @nativeSelection.getRangeAt(0) else null
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
    return unless @nativeSelection? and @editor.root.ownerDocument.activeElement?.tagName != 'BODY'
    @nativeSelection.removeAllRanges()
    if range?
      nativeRange = rangy.createRangyRange()
      _.each([range.start, range.end], (pos, i) ->
        [node, offset] = ScribeUtils.findDeepestNode(pos.leafNode, pos.offset)
        node = node.parentNode if node.tagName == "BR"              # Firefox does not split BR when hitting enter inside BR
        offset = Math.min(ScribeDOM.getText(node).length, offset)  # Should only occur at end of document
        fn = if i == 0 then 'setStart' else 'setEnd'
        nativeRange[fn].call(nativeRange, node, offset)
      )
      @nativeSelection.addRange(nativeRange, range.isBackwards)
    @editor.emit(@editor.constructor.events.SELECTION_CHANGE, range) unless silent or range == @range or @range?.equals(range)
    @range = range

  update: (silent = false) ->
    nativeRange = this.getNativeRange(true)
    unless compareRanges(nativeRange, @range)
      this.setRange(_nativeRangeToRange.call(this, nativeRange), silent)


module.exports = ScribeSelection
