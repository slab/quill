ScribeDOM           = require('./dom')
ScribeDocument      = require('./document')
ScribeKeyboard      = require('./keyboard')
ScribeLine          = require('./line')
ScribeNormalizer    = require('./normalizer')
ScribePasteManager  = require('./paste-manager')
ScribeRenderer      = require('./renderer')
ScribeSelection     = require('./selection')
ScribeUndoManager   = require('./undo-manager')
Tandem              = require('tandem-core')


DEFAULT_API_OPTIONS = { silent: false, source: 'api' }


_deleteAt = (index, length) ->
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
          ScribeDOM.removeNode(curLine.node)
          @doc.removeLine(curLine)
      else
        curLine.deleteText(offset, deleteLength)
      length -= deleteLength
      curLine = nextLine
      offset = 0
    if firstLine? and !firstLine.trailingNewline
      @doc.mergeLines(firstLine, firstLine.next)
  )

_forceTrailingNewline = ->
  unless @doc.lines.last?.trailingNewline
    # Can't do this.insertAt since still within the doAt call, this \n will already been recorded by _trackDelta
    _insertAt.call(this, this.getLength(), "\n")

# formatAt (Number index, Number length, String name, Mixed value) ->
_formatAt = (index, length, name, value) ->
  @selection.preserve(index, 0, =>
    [line, offset] = @doc.findLineAtOffset(index)
    while line? and length > 0
      if ScribeLine.FORMATS[name]?
        # If newline character is being applied with formatting
        if length > line.length - offset
          line.format(name, value)
      else if @doc.formatManager.formats[name]?
        if line.length - offset >= length
          line.formatText(offset, length, name, value)
        else
          line.formatText(offset, line.length - offset, name, value)
      else
        throw new Error("Unsupported format #{name} #{value}")
      length -= (line.length - offset)
      offset = 0
      line = line.next
  )

_insertAt = (index, text, formatting = {}) ->
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
          line.resetContent()
      offset = 0
    )
  )

_trackDelta = (fn, options) ->
  oldIndex = @savedRange?.start.index
  fn()
  newDelta = @doc.toDelta()
  try
    newIndex = @selection.getRange()?.start.index     # this.getSelection() triggers infinite loop
    if oldIndex? and newIndex? and oldIndex <= @delta.endLength and newIndex <= newDelta.endLength
      [oldLeftDelta, oldRightDelta] = @delta.split(oldIndex)
      [newLeftDelta, newRightDelta] = newDelta.split(newIndex)
      decomposeLeft = newLeftDelta.decompose(oldLeftDelta)
      decomposeRight = newRightDelta.decompose(oldRightDelta)
      decomposeA = decomposeLeft.merge(decomposeRight)
  catch ignored
  decomposeB = newDelta.decompose(@delta)
  if decomposeA and decomposeB
    decompose = if decomposeA.ops.length < decomposeB.ops.length then decomposeA else decomposeB
  else
    decompose = decomposeA or decomposeB
  return decompose

_update = ->
  delta = _trackDelta.call(this, =>
    this.doSilently( =>
      @selection.preserve( =>
        ScribeNormalizer.breakBlocks(@root)
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
          @doc.normalizer.normalizeLine(lineNode)
          newLine = @doc.appendLine(lineNode)
          lineNode = lineNode.nextSibling
      )
    )
  )
  return false if delta.isIdentity()
  oldDelta = @delta
  @delta = oldDelta.compose(delta)
  this.emit(ScribeEditor.events.USER_TEXT_CHANGE, delta, @delta)
  return delta
  

class ScribeEditor extends EventEmitter2
  @editors: []

  @ID_PREFIX: 'editor-'

  @DEFAULTS:
    cursor: 0
    enabled: true
    onReady: ->
    pollInterval: 100
    formatManager: {}
    renderer: {}
    undoManager: {}

  @events:
    API_TEXT_CHANGE  : 'api-text-change'
    PRE_EVENT        : 'pre-event'
    POST_EVENT       : 'post-event'
    SELECTION_CHANGE : 'selection-change'
    USER_TEXT_CHANGE : 'user-text-change'


  constructor: (@iframeContainer, options = {}) ->
    @id = _.uniqueId(ScribeEditor.ID_PREFIX)
    @options = _.defaults(options, ScribeEditor.DEFAULTS)
    @options.renderer['id'] = @id
    @iframeContainer = document.getElementById(@iframeContainer) if _.isString(@iframeContainer)
    this.reset(true)
    setInterval( =>
      changed = this.update()
      @selection.update(changed)
    , @options.pollInterval)
    this.on(ScribeEditor.events.SELECTION_CHANGE, (range) =>
      @savedRange = range
    )
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
    @options.renderer.keepHTML = keepHTML
    @iframeContainer.innerHTML = @root.innerHTML if @root?
    @renderer = new ScribeRenderer(@iframeContainer, @options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @renderer.root
    @doc = new ScribeDocument(@root, @options)
    @delta = @doc.toDelta()
    @keyboard = new ScribeKeyboard(this)
    @selection = new ScribeSelection(this)
    @undoManager = new ScribeUndoManager(this, @options)
    @pasteManager = new ScribePasteManager(this)
    @renderer.runWhenLoaded(@options.onReady)
    @ignoreDomChanges = false
    ScribeEditor.editors.push(this)

  applyDelta: (delta, options = {}) ->
    options = _.defaults(options, DEFAULT_API_OPTIONS)
    return if delta.isIdentity()
    # Make exception for systems that assume editors start with empty text
    if delta.startLength == 0 and this.getLength() == 1
      return this.setDelta(delta, options)
    this.doSilently( =>
      throw new Error("Trying to apply delta to incorrect doc length") unless delta.startLength == @delta.endLength
      #localDelta = this.update()
      #delta = delta.follows(localDelta, false) if localDelta
      delta.apply(_insertAt, _deleteAt, _formatAt, this)
      oldDelta = @delta
      @delta = oldDelta.compose(delta)
      unless options.silent
        eventName = if options.source == 'api' then ScribeEditor.events.API_TEXT_CHANGE else ScribeEditor.events.USER_TEXT_CHANGE
        this.emit(eventName, delta, @delta)
      # TODO enable when we figure out addNewline issue, currently will fail if we do add newline
      # console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
      _forceTrailingNewline.call(this)
    )

  emit: (eventName, args...) ->
    super(ScribeEditor.events.PRE_EVENT, eventName, args...)
    super(eventName, args...)
    super(ScribeEditor.events.POST_EVENT, eventName, args...)

  deleteAt: (index, length, options = {}) ->
    this.applyDelta(Tandem.Delta.makeDeleteDelta(@delta.endLength, index, length), options)

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  formatAt: (index, length, name, value, options = {}) ->
    attribute = {}
    attribute[name] = value
    this.applyDelta(Tandem.Delta.makeRetainDelta(@delta.endLength, index, length, attribute), options)
    
  getDelta: ->
    return @delta

  getLength: ->
    return @delta.endLength

  getSelection: ->
    return @selection.getRange()

  insertAt: (index, text, formatting = {}, options = {}) ->
    this.applyDelta(Tandem.Delta.makeInsertDelta(@delta.endLength, index, text, formatting), options)

  setDelta: (delta) ->
    oldLength = delta.startLength
    delta.startLength = this.getLength()
    this.applyDelta(delta, { silent: true })
    @undoManager.clear()
    delta.startLength = oldLength

  setSelection: (range, silent = false) ->
    @selection.setRange(range, silent)

  update: ->
    if @innerHTML != @root.innerHTML
      delta = _update.call(this)
      @innerHTML = @root.innerHTML
      return delta
    else
      return false


module.exports = ScribeEditor
