_                = require('lodash')
ScribeDOM        = require('./dom')
ScribeDocument   = require('./document')
ScribeLine       = require('./line')
ScribeNormalizer = require('./normalizer')
ScribeRenderer   = require('./renderer')
ScribeSelection  = require('./selection')
ScribeUtils      = require('./utils')
Tandem           = require('tandem-core')


_deleteAt = (index, length) ->
  return if length <= 0
  @selection.preserve(index, -1 * length, =>
    [firstLine, offset] = @doc.findLineAtOffset(index)
    curLine = firstLine
    while curLine? and length > 0
      deleteLength = Math.min(length, curLine.length - offset + 1)
      nextLine = curLine.next
      if deleteLength <= curLine.length
        curLine.deleteText(offset, deleteLength)
      else
        ScribeDOM.removeNode(curLine.node)
        @doc.removeLine(curLine)
      length -= deleteLength
      curLine = nextLine
      offset = 0
    @doc.mergeLines(firstLine, firstLine.next) if firstLine?.next != nextLine
  )

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
    if !line?
      # TODO only really makes sense if offset is also 0, signifying the end of the document
      # TODO clean up... this add line logic doesnt belong here
      lineNode = @root.ownerDocument.createElement('div')
      @root.appendChild(lineNode)
      lineNode.appendChild(@root.ownerDocument.createElement('br'))
      line = @doc.appendLine(lineNode)
      offset = 0
      # TODO this logic is very unintuitive without going through all the cases...
      if lineTexts.length > 1 and lineTexts[0] == "" and lineTexts[1] == ""
        lineTexts.shift()
    _.each(lineTexts, (lineText, i) =>
      line.insertText(offset, lineText, formatting)
      if i < lineTexts.length - 1       # Are there more lines to insert?
        line = @doc.splitLine(line, offset + lineText.length)
        offset = 0
    )
  )

_trackDelta = (fn, options) ->
  oldIndex = @savedRange?.start.index
  fn()
  newDelta = @doc.toDelta()
  try
    newIndex = @selection.getRange()?.start.index
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


class ScribeEditor
  constructor: (@iframeContainer, @scribe, @options = {}) ->
    @iframeContainer = document.querySelector(@iframeContainer) if _.isString(@iframeContainer)
    this.init()
    setInterval(this.checkUpdate.bind(this), @options.pollInterval)
    @scribe.on(@scribe.constructor.events.SELECTION_CHANGE, (range) =>
      @savedRange = range
    )
    this.enable() unless @options.readOnly

  disable: ->
    this.enable(false)

  enable: (enabled = true) ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', enabled)
    )

  init: ->
    @ignoreDomChanges = true
    @renderer = new ScribeRenderer(@iframeContainer, @scribe, @options)
    @contentWindow = @renderer.iframe.contentWindow
    @root = @renderer.root
    @doc = new ScribeDocument(@root, @options)
    @delta = @doc.toDelta()
    @selection = new ScribeSelection(this, @scribe)
    @ignoreDomChanges = false

  applyDelta: (delta, options = {}) ->
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
          @scribe.emit(@scribe.constructor.events.TEXT_CHANGE, delta, options.source)
      if localDelta and !localDelta.isIdentity()
        @scribe.emit(@scribe.constructor.events.TEXT_CHANGE, localDelta, 'user')
      @innerHTML = @root.innerHTML
    )

  checkUpdate: ->
    delta = this.update()
    if delta
      oldDelta = @delta
      @delta = oldDelta.compose(delta)
      @scribe.emit(@scribe.constructor.events.TEXT_CHANGE, delta, 'user')
    @selection.update(delta != false)

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  getDelta: ->
    return @delta

  update: ->
    if @innerHTML != @root.innerHTML
      delta = _update.call(this)
      @innerHTML = @root.innerHTML
      return delta
    else
      return false


module.exports = ScribeEditor
