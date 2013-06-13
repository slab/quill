Scribe = require('./scribe')
Tandem = require('tandem-core')


doAt = (fn, external = false) ->
  this.doSilently( =>
    trackDelta.call(this, =>
      keepNormalized.call(this, =>
        fn.call(this)
      )
    , external)
  )

initListeners = ->
  onEditOnce = =>
  onEdit = =>
    onEditOnce = _.once(onEdit)
    return if @ignoreDomChanges or !@renderer.iframe.parentNode?    # Make sure we have not been deleted
    this.update()
  onSubtreeModified = (arg1, arg2) =>
    return if @ignoreDomChanges
    toCall = onEditOnce
    _.defer( =>
      toCall.call(null)
    )
  onEditOnce = _.once(onEdit)
  @root.addEventListener('DOMSubtreeModified', onSubtreeModified)

preserveSelection = (index, lengthAdded, fn, args...) ->
  range = this.getSelection()
  if range?
    indexes = _.map([range.start, range.end], (pos) ->
      posIndex = pos.getIndex()
      if index >= posIndex
        return posIndex
      else
        return Math.max(posIndex + lengthAdded, index)
    )
    fn.apply(this, args)
    this.setSelection(new Scribe.Range(this, indexes[0], indexes[1]))
  else
    fn.apply(this, args)

deleteAt = (index, length) ->
  return if length <= 0
  preserveSelection.call(this, index, -1 * length, =>
    [firstLine, offset] = @doc.findLineAtOffset(index)
    curLine = firstLine
    while curLine? and length > 0
      deleteLength = Math.min(length, curLine.length - offset)
      nextLine = curLine.next
      if curLine.length == deleteLength
        if curLine == @doc.lines.first and curLine == @doc.lines.last
          curLine.node.innerHTML = ''
          curLine.trailingNewline = false
          curLine.rebuild()
        else
          Scribe.Utils.removeNode(curLine.node)
          @doc.removeLine(curLine)
      else
        curLine.deleteText(offset, deleteLength)
      length -= deleteLength
      curLine = nextLine
      offset = 0
    if firstLine? and !firstLine.trailingNewline
      @doc.mergeLines(firstLine, firstLine.next)
  )

forceTrailingNewline = ->
  unless @doc.lines.last?.trailingNewline
    this.insertAt(this.getLength(), "\n", {}, false)

# formatAt (Number index, Number length, String name, Mixed value) ->
formatAt = (index, length, name, value) ->
  preserveSelection.call(this, index, 0, =>
    [line, offset] = @doc.findLineAtOffset(index)
    while line? and length > 0
      if Scribe.Line.FORMATS[name]?
        # If newline character is being applied with formatting
        if length > line.length - offset
          line.format(name, value)
      else if @renderer.formats[name]?
        if line.length - offset >= length
          line.formatText(offset, length, name, value)
        else
          line.formatText(offset, line.length - offset, name, value)
      else
        console.warn 'Unsupported format', name, value
      length -= (line.length - offset)
      offset = 0
      line = line.next
  )

insertAt = (index, text, formatting = {}) ->
  preserveSelection.call(this, index, text.length, =>
    text = text.replace(/\r\n/g, '\n')
    text = text.replace(/\r/g, '\n')
    lineTexts = text.split('\n')
    if index == this.getLength() and @doc.lines.last.trailingNewline
      if lineTexts[lineTexts.length - 1] == ''
        lineTexts.pop()
      line = @doc.splitLine(@doc.lines.last, @doc.lines.last.length)
      offset = 0
    else
      [line, offset] = @doc.findLineAtOffset(index)
    _.each(lineTexts, (lineText, i) =>
      line.insertText(offset, lineText, formatting)
      if i < lineTexts.length - 1
        if line.trailingNewline
          line = @doc.splitLine(line, offset + lineText.length)
        else
          line.trailingNewline = true
          line.length += 1
      offset = 0
    )
  )

keepNormalized = (fn) ->
  fn.call(this)
  @doc.rebuildDirty()

trackDelta = (fn, external = false) ->
  oldDelta = @doc.toDelta()
  oldIndex = @selection.range?.start.index # We do not want new range value so we do not use getSelection
  fn()
  newDelta = @doc.toDelta()
  try
    newIndex = this.getSelection()?.start.index
    if oldIndex? and newIndex? and oldIndex <= oldDelta.endLength and newIndex <= newDelta.endLength
      [oldLeftDelta, oldRightDelta] = oldDelta.split(oldIndex)
      [newLeftDelta, newRightDelta] = newDelta.split(newIndex)
      decomposeLeft = newLeftDelta.decompose(oldLeftDelta)
      decomposeRight = newRightDelta.decompose(oldRightDelta)
      decompose = decomposeLeft.merge(decomposeRight)
  catch ignored
  decompose = newDelta.decompose(oldDelta) unless decompose?
  compose = oldDelta.compose(decompose)
  console.assert(compose.isEqual(newDelta), oldDelta, newDelta, decompose, compose)
  unless decompose.isIdentity()
    eventName = if external then Scribe.Editor.events.API_TEXT_CHANGE else Scribe.Editor.events.TEXT_CHANGE
    this.emit(eventName, decompose)
  

class Scribe.Editor extends EventEmitter2
  @editors: []

  @ID_PREFIX: 'editor-'
  @CURSOR_PREFIX: 'cursor-'
  @DEFAULTS:
    cursor: 0
    enabled: true
    styles: {}
  @events:
    API_TEXT_CHANGE  : 'api-text-change'
    PRE_EVENT        : 'pre-event'
    POST_EVENT       : 'post-event'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'

  constructor: (@iframeContainer, options) ->
    @options = _.extend(Scribe.Editor.DEFAULTS, options)
    @id = _.uniqueId(Scribe.Editor.ID_PREFIX)
    @iframeContainer = document.getElementById(@iframeContainer) if _.isString(@iframeContainer)
    this.reset(true)
    this.enable() if @options.enabled

  disable: ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', false)
    )

  enable: ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', true)
    )

  reset: (keepHTML = false) ->
    @ignoreDomChanges = true
    options = _.clone(@options)
    options.keepHTML = keepHTML
    options.id = @id
    @iframeContainer.innerHTML = @root.innerHTML if @root?
    @renderer = new Scribe.Renderer(@iframeContainer, options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @renderer.root
    @doc = new Scribe.Document(@root, @renderer)
    @selection = new Scribe.Selection(this)
    @keyboard = new Scribe.Keyboard(this)
    @undoManager = new Scribe.UndoManager(this)
    @pasteManager = new Scribe.PasteManager(this)
    initListeners.call(this)
    @ignoreDomChanges = false
    Scribe.Editor.editors.push(this)

  applyDelta: (delta, external = true) ->
    # Make exception for systems that assume editors start with empty text
    if delta.startLength == 0 and this.getLength() == 1
      return this.setDelta(delta, external)
    return if delta.isIdentity()
    this.doSilently( =>
      @selection.preserve( =>
        console.assert(delta.startLength == this.getLength(), "Trying to apply delta to incorrect doc length", delta, this.getLength())
        oldDelta = @doc.toDelta()
        delta.apply(insertAt, deleteAt, formatAt, this)
        eventName = if external then Scribe.Editor.events.API_TEXT_CHANGE else Scribe.Editor.events.TEXT_CHANGE
        this.emit(eventName, delta)
        # TODO enable when we figure out addNewline issue, currently will fail if we do add newline
        # console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
        forceTrailingNewline.call(this)
      )
    )

  emit: (eventName, args...) ->
    super(Scribe.Editor.PRE_EVENT, eventName, args...)
    super(eventName, args...)
    super(Scribe.Editor.POST_EVENT, eventName, args...)

  deleteAt: (index, length, external = true) ->
    doAt.call(this, =>
      deleteAt.call(this, index, length)
      forceTrailingNewline.call(this)
    , external)

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  formatAt: (index, length, name, value, external = true) ->
    doAt.call(this, =>
      formatAt.call(this, index, length, name, value)
    , external)
    
  getDelta: ->
    return @doc.toDelta()

  getLength: ->
    return @doc.toDelta().endLength

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text, formatting = {}, external = true) ->
    doAt.call(this, =>
      insertAt.call(this, index, text, formatting)
      forceTrailingNewline.call(this)
    , external)

  setDelta: (delta, external = true) ->
    oldLength = delta.startLength
    delta.startLength = this.getLength()
    this.applyDelta(delta, external)
    delta.startLength = oldLength
    
  setSelection: (range, silent = false) ->
    @selection.setRange(range, silent)

  update: ->
    this.doSilently( =>
      trackDelta.call(this, =>
        @selection.preserve( =>
          Scribe.Normalizer.breakBlocks(@root)
          lines = @doc.lines.toArray()
          lineNode = @root.firstChild
          _.each(lines, (line, index) =>
            while line.node != lineNode
              if line.node.parentNode == @root
                @doc.normalizer.normalizeLine(lineNode)
                newLine = @doc.insertLineBefore(lineNode, line)
                lineNode = lineNode.nextSibling
              else
                return @doc.removeLine(line)
            @doc.updateLine(line)
            lineNode = lineNode.nextSibling
          )
          while lineNode != null
            newLine = @doc.appendLine(lineNode)
            lineNode = lineNode.nextSibling
        )
      )
    )


module.exports = Scribe
