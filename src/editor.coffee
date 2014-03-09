_                   = require('lodash')
EventEmitter2       = require('eventemitter2').EventEmitter2
ScribeDOM           = require('./dom')
ScribeDocument      = require('./document')
ScribeKeyboard      = require('./keyboard')
ScribeLine          = require('./line')
ScribeLogger        = require('./logger')
ScribeNormalizer    = require('./normalizer')
ScribePasteManager  = require('./paste-manager')
ScribeRenderer      = require('./renderer')
ScribeSelection     = require('./selection')
ScribeUndoManager   = require('./undo-manager')
ScribeUtils         = require('./utils')
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
    @scribe.insertText(@delta.endLength, "\n")

# formatAt (Number index, Number length, String name, Mixed value) ->
_formatAt = (index, length, name, value) ->
  @selection.preserve(index, 0, =>
    [line, offset] = @doc.findLineAtOffset(index)
    while line? and length > 0
      if ScribeLine.FORMATS[name]?
        # If newline character is being applied with formatting
        if length > line.length - offset
          line.format(name, value)
      else
        line.formatText(offset, Math.min(length, line.length - offset), name, value)
      length -= (line.length - offset)
      offset = 0
      line = line.next
  )

_insertAt = (index, text, formatting = {}) ->
  @selection.preserve(index, text.length, =>
    text = text.replace(/\r\n/g, '\n')
    text = text.replace(/\r/g, '\n')
    lineTexts = text.split('\n')
    [line, offset] = @doc.findLineAtOffset(index)
    if line == @doc.lines.last and offset >= line.length and line.trailingNewline
      line = @doc.splitLine(line, line.length)
      line.trailingNewline = false
      line.resetContent()
      offset = 0
    _.each(lineTexts, (lineText, i) =>
      line.insertText(offset, lineText, formatting)
      if i < lineTexts.length - 1       # Are there more lines to insert?
        line = @doc.splitLine(line, offset + lineText.length)
        offset = 0
    )
  )

_preformat = (name, value) ->
  format = @doc.formatManager.formats[name]
  throw new Error("Unsupported format #{name} #{value}") unless format?
  format.preformat(value)

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
      ScribeNormalizer.normalizeEmptyDoc(@root)
      ScribeNormalizer.normalizeEmptyLines(@root)
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
  return if delta.isIdentity() then false else delta


class ScribeEditor extends EventEmitter2
  @editors: []

  @events:
    FOCUS_CHANGE     : 'focus-change'
    POST_EVENT       : 'post-event'
    PRE_EVENT        : 'pre-event'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'


  constructor: (@iframeContainer, @scribe, @options = {}) ->
    @iframeContainer = document.querySelector(@iframeContainer) if _.isString(@iframeContainer)
    @logger = new ScribeLogger(this, @options.logLevel)
    this.init()
    setInterval( =>
      this.checkUpdate()
    , @options.pollInterval)
    this.on(ScribeEditor.events.SELECTION_CHANGE, (range) =>
      @savedRange = range
    )
    this.enable() unless @options.readonly

  disable: ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', false)
    )

  enable: ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', true)
    )

  init: ->
    @ignoreDomChanges = true
    @renderer = new ScribeRenderer(@iframeContainer, @options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @renderer.root
    @doc = new ScribeDocument(@root, @options)
    @delta = @doc.toDelta()
    @keyboard = new ScribeKeyboard(this)
    @selection = new ScribeSelection(this)
    @undoManager = new ScribeUndoManager(this, @options)
    @pasteManager = new ScribePasteManager(this)
    @ignoreDomChanges = false

  applyDelta: (delta, options = {}) ->
    options = _.defaults(options, DEFAULT_API_OPTIONS)
    return if delta.isIdentity()
    this.doSilently( =>
      localDelta = this.update()
      if localDelta
        @delta = @delta.compose(localDelta)
        tempDelta = localDelta
        localDelta = localDelta.transform(delta, true)
        delta = delta.transform(tempDelta, false)
      unless delta.isIdentity()   # Follows may have turned delta into the identity
        throw new Error("Trying to apply delta to incorrect doc length") unless delta.startLength == @delta.endLength
        delta.apply(_insertAt, _deleteAt, _formatAt, this)
        oldDelta = @delta
        @delta = oldDelta.compose(delta)
        unless options.silent
          this.emit(ScribeEditor.events.TEXT_CHANGE, delta, options.source)
      if localDelta and !localDelta.isIdentity()
        this.emit(ScribeEditor.events.TEXT_CHANGE, localDelta, 'user')
      @innerHTML = @root.innerHTML
      # TODO enable when we figure out addNewline issue, currently will fail if we do add newline
      # console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
      _forceTrailingNewline.call(this)
    )

  checkUpdate: ->
    delta = this.update()
    if delta
      oldDelta = @delta
      @delta = oldDelta.compose(delta)
      this.emit(ScribeEditor.events.TEXT_CHANGE, delta, 'user')
    @selection.update(delta != false)

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  emit: (eventName, args...) ->
    super(ScribeEditor.events.PRE_EVENT, eventName, args...)
    @logger.info(eventName, args...) if _.indexOf(_.values(ScribeEditor.events), eventName) > -1
    super(eventName, args...)
    super(ScribeEditor.events.POST_EVENT, eventName, args...)

  insertAt: (index, text, formats, options = {}) ->
    delta = Tandem.Delta.makeInsertDelta(@delta.endLength, index, text, formats)
    this.applyDelta(delta, options)

  deleteAt: (index, length, options = {}) ->
    delta = Tandem.Delta.makeDeleteDelta(@delta.endLength, index, length)
    this.applyDelta(delta, options)

  formatAt: (index, length, name, value, options = {}) ->
    if length > 0
      attribute = {}
      attribute[name] = value
      this.applyDelta(Tandem.Delta.makeRetainDelta(@delta.endLength, index, length, attribute), options)
    else
      _preformat.call(this, name, value)

  getDelta: ->
    return @delta

  getSelection: ->
    return @selection.getRange()

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
