Scribe = require('./scribe')
Tandem = require('tandem-core')


doAt = (fn, options = { internal: true }) ->
  this.doSilently( =>
    trackDelta.call(this, =>
      fn.call(this)
    , options)
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

deleteAt = (index, length) ->
  return if length <= 0
  @selection.preserve(index, -1 * length, =>
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
    @doc.rebuildDirty()
  )

forceTrailingNewline = ->
  unless @doc.lines.last?.trailingNewline
    this.insertAt(this.getLength(), "\n", {}, false)

# formatAt (Number index, Number length, String name, Mixed value) ->
formatAt = (index, length, name, value) ->
  @selection.preserve(index, 0, =>
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
    @doc.rebuildDirty()
  )

insertAt = (index, text, formatting = {}) ->
  @selection.preserve(index, text.length, =>
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
    @doc.rebuildDirty()
  )

trackDelta = (fn, options = { internal: true }) ->
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
      decomposeA = decomposeLeft.merge(decomposeRight)
  catch ignored
  decomposeB = newDelta.decompose(oldDelta)
  if decomposeA and decomposeB
    decompose = if decomposeA.ops.length < decomposeB.ops.length then decomposeA else decomposeB
  else
    decompose = decomposeA or decomposeB
  compose = oldDelta.compose(decompose)
  console.assert(compose.isEqual(newDelta), oldDelta, newDelta, decompose, compose)
  if !decompose.isIdentity() and options.internal
    this.emit(Scribe.Editor.events.TEXT_CHANGE, decompose)
  

class Scribe.Editor extends EventEmitter2
  @editors: []

  @ID_PREFIX: 'editor-'
  @CURSOR_PREFIX: 'cursor-'
  @DEFAULTS:
    cursor: 0
    enabled: true
    onReady: ->
    styles: {}
  @events:
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
    @renderer.runWhenLoaded(@options.onReady)
    initListeners.call(this)
    @ignoreDomChanges = false
    Scribe.Editor.editors.push(this)

  applyDelta: (delta, options = {}) ->
    # Make exception for systems that assume editors start with empty text
    if delta.startLength == 0 and this.getLength() == 1
      return this.setDelta(delta, options)
    return if delta.isIdentity()
    this.doSilently( =>
      console.assert(delta.startLength == this.getLength(), "Trying to apply delta to incorrect doc length", delta, this.getLength())
      oldDelta = @doc.toDelta()
      delta.apply(insertAt, deleteAt, formatAt, this)
      this.emit(Scribe.Editor.events.TEXT_CHANGE, delta) if options.internal
      # TODO enable when we figure out addNewline issue, currently will fail if we do add newline
      # console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
      forceTrailingNewline.call(this)
    )

  emit: (eventName, args...) ->
    super(Scribe.Editor.PRE_EVENT, eventName, args...)
    super(eventName, args...)
    super(Scribe.Editor.POST_EVENT, eventName, args...)

  deleteAt: (index, length, options = {}) ->
    doAt.call(this, =>
      deleteAt.call(this, index, length)
      forceTrailingNewline.call(this)
    , options)

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  formatAt: (index, length, name, value, options = {}) ->
    doAt.call(this, =>
      formatAt.call(this, index, length, name, value)
    , options)
    
  getDelta: ->
    return @doc.toDelta()

  getLength: ->
    return @doc.toDelta().endLength

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text, formatting = {}, options = {}) ->
    doAt.call(this, =>
      insertAt.call(this, index, text, formatting)
      forceTrailingNewline.call(this)
    , options)

  setDelta: (delta, options = {}) ->
    oldLength = delta.startLength
    delta.startLength = this.getLength()
    this.applyDelta(delta, options)
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
