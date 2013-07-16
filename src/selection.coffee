Scribe = require('./scribe')


# DOM Selection API says offset is child index of container, not number of characters like Scribe.Position
normalizeNativePosition = (node, offset) ->
  if node?.nodeType == node.ELEMENT_NODE
    if offset == 0
      node = node.firstChild if node.firstChild?
    else
      node = node.childNodes[node.childNodes.length-1]
      offset = node.textContent.length
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
  nativeRange = normalizeNativeRange(nativeRange)
  start = new Scribe.Position(@editor, nativeRange.startContainer, nativeRange.startOffset)
  end = new Scribe.Position(@editor, nativeRange.endContainer, nativeRange.endOffset)
  if start.index <= end.index 
    return new Scribe.Range(@editor, start, end)
  else
    return new Scribe.Range(@editor, end, start)

_preserveWithIndex = (nativeRange, index, lengthAdded, fn) ->
  range = _nativeRangeToRange.call(this, nativeRange)
  [startIndex, endIndex] = _.map([range.start, range.end], (pos) ->
    if index >= pos.index
      return pos.index
    else
      return Math.max(pos.index + lengthAdded, index)
  )
  fn.call(null)
  this.setRange(new Scribe.Range(@editor, startIndex, endIndex), true)

_preserveWithLine = (nativeRange, fn) ->
  savedNativeRange = normalizeNativeRange(nativeRange)
  savedData = _.map([
    { container: savedNativeRange.startContainer, offset: savedNativeRange.startOffset }
    { container: savedNativeRange.endContainer,   offset: savedNativeRange.endOffset }
  ], (position) ->
    lineNode = Scribe.Utils.findAncestor(position.container, Scribe.Line.isLineNode) or @editor.root
    return {
      lineNode  : lineNode
      offset    : Scribe.Position.getIndex(position.container, position.offset, lineNode)
      nextLine  : position.container.previousSibling?.tagName == 'BR'  # Track special case for Firefox
    }
  )
  fn.call(null)
  nativeRange = normalizeNativeRange(this.getNativeRange())
  if !_.isEqual(nativeRange, savedNativeRange)
    [start, end] = _.map(savedData, (savedDatum) =>
      if savedDatum.nextLine and savedDatum.lineNode.nextSibling?
        savedDatum.lineNode = savedDatum.lineNode.nextSibling
        savedDatum.offset = 0
      return new Scribe.Position(@editor, savedDatum.lineNode, savedDatum.offset)
    )
    this.setRange(new Scribe.Range(@editor, start, end), true)


class Scribe.Selection
  constructor: (@editor) ->
    @range = null
    this.initListeners()
    @editor.renderer.runWhenLoaded( =>
      rangy.init()
      @nativeSelection = rangy.getIframeSelection(@editor.renderer.iframe)
      this.setRange(null)
    )

  initListeners: ->
    checkUpdate = =>
      this.update() if @editor.root.isContentEditable
    @editor.root.addEventListener('mouseup', checkUpdate)
    _.each(Scribe.Keyboard.NAVIGATION, (key) =>
      @editor.keyboard.addHotkey(key, =>
        _.defer(checkUpdate)
      )
    )
    setInterval( =>
      checkUpdate() unless @range?    # Less important to detect existing range being unset
    , 100)

  format: (name, value) ->
    this.update()
    return unless @range
    start = @range.start.index
    end = @range.end.index
    formats = @range.getFormats()
    @editor.formatAt(start, end - start, name, value, { source: 'user' }) if end > start
    formats[name] = value
    @range.formats = formats
    this.setRange(new Scribe.Range(@editor, start, end))

  deleteRange: ->
    this.update()
    return false if @range.isCollapsed()
    @editor.deleteAt(@range.start.index, @range.end.index - @range.start.index)
    this.update()
    return @range

  getDimensions: ->
    rangyRange = this.getNativeRange()
    return rangyRange?.nativeRange?.getBoundingClientRect()
    
  getNativeRange: ->
    return null unless @nativeSelection
    @nativeSelection.refresh()
    return if @nativeSelection?.rangeCount > 0 then @nativeSelection.getRangeAt(0) else null

  getRange: ->
    nativeRange = this.getNativeRange()
    return if nativeRange? then _nativeRangeToRange.call(this, nativeRange) else null

  preserve: (index, lengthAdded, fn) ->
    fn = index if _.isFunction(index)
    nativeRange = this.getNativeRange()
    if nativeRange?
      if _.isFunction(index)
        _preserveWithLine.call(this, nativeRange, index)
      else
        _preserveWithIndex.call(this, nativeRange, index, lengthAdded, fn)
    else
      fn.call(null)

  setRange: (range, silent = false) ->
    return unless @nativeSelection?
    unless silent
      # If we are not emitting change, we don't care what the cursor was
      this.update(true) unless silent
      return if range == @range or @range?.equals(range)
    @range = range
    if @range?
      nativeRange = rangy.createRangyRange()
      _.each([@range.start, @range.end], (pos, i) ->
        [node, offset] = Scribe.DOM.findDeepestNode(pos.leafNode, pos.offset)
        node = node.parentNode if node.tagName == "BR"      # Firefox does not like selections inside break tags
        offset = Math.min(node.textContent.length, offset)  # Should only occur at end of document
        fn = if i == 0 then 'setStart' else 'setEnd'
        nativeRange[fn].call(nativeRange, node, offset)
      )
      @nativeSelection.setSingleRange(nativeRange)
    else
      @nativeSelection.removeAllRanges()
    @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, @range) unless silent

  update: (silent = false) ->
    range = this.getRange()
    unless range == @range or @range?.equals(range)
      @editor.emit(Scribe.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range


module.exports = Scribe
