doAt = (fn) ->
  doSilently.call(this, =>
    @selection.preserve( =>
      return trackDelta.call(this, =>
        keepNormalized.call(this, =>
          fn.call(this)
        )
      )
    )
  )

doSilently = (fn) ->
  oldIgnoreDomChange = @ignoreDomChanges
  @ignoreDomChanges = true
  fn()
  @ignoreDomChanges = oldIgnoreDomChange

initListeners = ->
  onEditOnce = =>
  onEdit = =>
    onEditOnce = _.once(onEdit)
    return if @ignoreDomChanges
    update.call(this)
  onSubtreeModified = =>
    return if @ignoreDomChanges
    toCall = onEditOnce
    _.defer( =>
      toCall.call(null)
    )
  onEditOnce = _.once(onEdit)
  @root.addEventListener('DOMSubtreeModified', onSubtreeModified)

deleteAt = (index, length) ->
  return if length <= 0
  [firstLine, offset] = @doc.findLineAtOffset(index)
  curLine = firstLine
  while curLine? and length > 0
    deleteLength = Math.min(length, curLine.length - offset)
    nextLine = curLine.next
    if curLine.length == deleteLength
      Scribe.Utils.removeNode(curLine.node)
      @doc.removeLine(curLine)
    else
      curLine.deleteText(offset, deleteLength)
    length -= deleteLength
    curLine = nextLine
    offset = 0
  if firstLine? and !firstLine.trailingNewline
    @doc.mergeLines(firstLine, firstLine.next)

forceTrailingNewline = ->
  unless @doc.lines.last?.trailingNewline
    this.insertAt(this.getLength(), "\n")

# formatAt (Number index, Number length, String name, Mixed value) ->
formatAt = (index, length, name, value) ->
  [line, offset] = @doc.findLineAtOffset(index)
  while line? and length > 0
    if Scribe.Constants.LINE_FORMATS[name]?
      # If newline character is being applied with formatting
      if length > line.length - offset
        line.format(name, value)
    else if Scribe.Constants.LEAF_FORMATS[name]?
      if line.length - offset >= length
        line.formatText(offset, length, name, value)
      else
        line.formatText(offset, line.length - offset, name, value)
    else
      console.warn 'Unsupported format'
    length -= (line.length - offset)
    offset = 0
    line = line.next

insertAt = (index, text, formatting = {}) ->
  text = text.replace(/\r\n/g, '\n')
  text = text.replace(/\r/g, '\n')
  lineTexts = text.split('\n')
  if index == this.getLength()
    if lineTexts[lineTexts.length - 1] == ''
      lineTexts.pop()
    else if false
      # TODO fix this in the case of being called from applyDelta
      addNewlineDelta = new Tandem.Delta(this.getLength(), [
        new Tandem.RetainOp(0, this.getLength())
        new Tandem.InsertOp("\n")
      ])
      #this.emit(ScribeEditor.events.TEXT_CHANGE, addNewlineDelta)
    line = @doc.splitLine(@doc.lines.last, @doc.lines.last.length)
    offset = 0
  else
    [line, offset] = @doc.findLineAtOffset(index)
  _.each(lineTexts, (lineText, i) =>
    line.insertText(offset, lineText, formatting)
    if i < lineTexts.length - 1
      line = @doc.splitLine(line, offset + lineText.length)
    offset = 0
  )

keepNormalized = (fn) ->
  fn.call(this)
  @doc.rebuildDirty()

trackDelta = (fn) ->
  oldDelta = @doc.toDelta()
  fn()
  newDelta = @doc.toDelta()
  decompose = newDelta.decompose(oldDelta)
  compose = oldDelta.compose(decompose)
  console.assert(compose.isEqual(newDelta), oldDelta, newDelta, decompose, compose)
  this.emit(ScribeEditor.events.TEXT_CHANGE, decompose) unless decompose.isIdentity()
  return decompose

update = ->
  doSilently.call(this, =>
    @selection.preserve( =>
      return trackDelta.call(this, =>
        Scribe.Normalizer.breakBlocks(@root)
        lines = @doc.lines.toArray()
        lineNode = @root.firstChild
        _.each(lines, (line, index) =>
          while line.node != lineNode
            if line.node.parentNode == @root
              newLine = @doc.insertLineBefore(lineNode, line)
              lineNode = lineNode.nextSibling
            else
              @doc.removeLine(line)
              return
          @doc.updateLine(line)
          lineNode = lineNode.nextSibling
        )
        while lineNode != null
          newLine = @doc.appendLine(lineNode)
          lineNode = lineNode.nextSibling
      )
    )
  )
  


class ScribeEditor extends EventEmitter2
  @editors: []

  @CONTAINER_ID: 'scribe-container'
  @ID_PREFIX: 'editor-'
  @CURSOR_PREFIX: 'cursor-'
  @DEFAULTS:
    cursor: 0
    enabled: true
    styles: {}
  @events: 
    TEXT_CHANGE      : 'text-change'
    SELECTION_CHANGE : 'selection-change'

  constructor: (@iframeContainer, options) ->
    @options = _.extend(Scribe.Editor.DEFAULTS, options)
    @id = _.uniqueId(ScribeEditor.ID_PREFIX)
    @iframeContainer = document.getElementById(@iframeContainer) if _.isString(@iframeContainer)
    this.reset(true)
    this.enable() if @options.enabled

  disable: ->
    doSilently.call(this, =>
      @root.setAttribute('contenteditable', false)
    )

  enable: ->
    if !@root.getAttribute('contenteditable')
      doSilently.call(this, =>
        @root.setAttribute('contenteditable', true)
      )

  reset: (keepHTML = false) ->
    @ignoreDomChanges = true
    options = _.clone(@options)
    options.keepHTML = keepHTML
    @renderer = new Scribe.Renderer(@iframeContainer, options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @contentWindow.document.getElementById(ScribeEditor.CONTAINER_ID)
    @doc = new Scribe.Document(@root)
    @selection = new Scribe.Selection(this)
    @keyboard = new Scribe.Keyboard(this)
    @undoManager = new Scribe.UndoManager(this)
    @pasteManager = new Scribe.PasteManager(this)
    initListeners.call(this)
    @ignoreDomChanges = false
    ScribeEditor.editors.push(this)

  applyDelta: (delta, external = true) ->
    # Make exception for systems that assume editors start with empty text
    if delta.startLength == 0 and this.getLength() == 1
      return this.setDelta(delta)
    return if delta.isIdentity()
    doSilently.call(this, =>
      @selection.preserve( =>
        console.assert(delta.startLength == this.getLength(), "Trying to apply delta to incorrect doc length", delta, @doc, @root)
        oldDelta = @doc.toDelta()
        delta.apply(insertAt, deleteAt, formatAt, this)
        unless external
          this.emit(ScribeEditor.events.TEXT_CHANGE, delta)
        # TODO enable when we figure out addNewline issue, currently will fail if we do add newline
        console.assert(delta.endLength == this.getLength(), "Applying delta resulted in incorrect end length", delta, this.getLength())
        forceTrailingNewline.call(this)
      )
    )

  deleteAt: (args...) ->
    doAt.call(this, =>
      deleteAt.apply(this, args)
      forceTrailingNewline.call(this)
    )

  formatAt: (args...) ->
    doAt.call(this, =>
      formatAt.apply(this, args)
    )
    
  getDelta: ->
    return @doc.toDelta()

  getLength: ->
    return @doc.toDelta().endLength

  getSelection: ->
    return @selection.getRange()

  insertAt: (args...) ->
    doAt.call(this, =>
      insertAt.apply(this, args)
      forceTrailingNewline.call(this)
    )

  setDelta: (delta) ->
    oldLength = delta.startLength
    delta.startLength = this.getLength()
    this.applyDelta(delta)
    delta.startLength = oldLength
    
  setSelection: (range) ->
    @selection.setRange(range)



window.Scribe ||= {}
window.Scribe.Editor = ScribeEditor
