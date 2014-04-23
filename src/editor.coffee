_          = require('lodash')
DOM        = require('./dom')
Document   = require('./document')
Line       = require('./line')
Normalizer = require('./normalizer')
Renderer   = require('./renderer')
Selection  = require('./selection')
Tandem     = require('tandem-core')


class Editor
  constructor: (@iframeContainer, @quill, @options = {}) ->
    @ignoreDomChanges = true
    @renderer = new Renderer(@iframeContainer, @quill, @options)
    @root = @renderer.root
    @doc = new Document(@root, @options)
    @delta = @doc.toDelta()
    @selection = new Selection(@doc, @quill)
    @ignoreDomChanges = false
    @timer = setInterval(_.bind(this.checkUpdate, this), @options.pollInterval)
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, (range) =>
      @savedRange = range
    )
    this.enable() unless @options.readOnly

  disable: ->
    this.enable(false)

  enable: (enabled = true) ->
    this.doSilently( =>
      @root.setAttribute('contenteditable', enabled)
    )

  applyDelta: (delta, options = {}) ->
    return if delta.isIdentity()
    this.doSilently( =>
      localDelta = this._update()
      if localDelta
        @delta = @delta.compose(localDelta)
        tempDelta = localDelta
        localDelta = localDelta.transform(delta, true)
        delta = delta.transform(tempDelta, false)
      unless delta.isIdentity()   # Follows may have turned delta into the identity
        throw new Error("Trying to apply delta to incorrect doc length") unless delta.startLength == @delta.endLength
        delta.apply(this._insertAt, this._deleteAt, this._formatAt, this)
        @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
        oldDelta = @delta
        @delta = oldDelta.compose(delta)
        @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, options.source) unless options.silent
      if localDelta and !localDelta.isIdentity() and !options.silent
        @quill.emit(@quill.constructor.events.TEXT_CHANGE, localDelta, 'user')
      @innerHTML = @root.innerHTML
    )

  checkUpdate: ->
    return clearInterval(@timer) if !@renderer.iframe.parentNode? or !@root.parentNode?
    delta = this._update()
    if delta
      oldDelta = @delta
      @delta = oldDelta.compose(delta)
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, 'user')
    @selection.update(delta != false)

  doSilently: (fn) ->
    oldIgnoreDomChange = @ignoreDomChanges
    @ignoreDomChanges = true
    fn()
    @ignoreDomChanges = oldIgnoreDomChange

  getDelta: ->
    return @delta

  _deleteAt: (index, length) ->
    return if length <= 0
    @selection.shiftAfter(index, -1 * length, =>
      [firstLine, offset] = @doc.findLineAt(index)
      curLine = firstLine
      mergeFirstLine = firstLine.length - offset <= length and offset > 0
      while curLine? and length > 0
        nextLine = curLine.next
        deleteLength = Math.min(curLine.length - offset, length)
        if offset == 0 and length >= curLine.length
          @doc.removeLine(curLine)
        else
          curLine.deleteText(offset, deleteLength)
        length -= deleteLength
        curLine = nextLine
        offset = 0
      @doc.mergeLines(firstLine, firstLine.next) if mergeFirstLine and firstLine.next
    )

  _formatAt: (index, length, name, value) ->
    @selection.shiftAfter(index, 0, =>
      [line, offset] = @doc.findLineAt(index)
      while line? and length > 0
        line.formatText(offset, Math.min(length, line.length - offset), name, value)
        length -= (line.length - offset)
        line.format(name, value) if length > 0
        length -= 1
        offset = 0
        line = line.next
    )

  _insertAt: (index, text, formatting = {}) ->
    @selection.shiftAfter(index, text.length, =>
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      lineTexts = text.split('\n')
      [line, offset] = @doc.findLineAt(index)
      if !line?   # Empty document
        line = @doc.appendLine(@root.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG))
        offset = 0
        line.insertText(offset, lineTexts[0], formatting)
        lineTexts = lineTexts.slice(1)
      _.each(lineTexts, (lineText, i) =>
        line.insertText(offset, lineText, formatting)
        if i < lineTexts.length - 1       # Are there more lines to insert?
          line = @doc.splitLine(line, offset + lineText.length)
          offset = 0
      )
    )

  _trackDelta: (fn, options) ->
    oldIndex = @savedRange?.start
    fn()
    newDelta = @doc.toDelta()
    try
      newIndex = @selection.getRange()?.start
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

  _update: ->
    return false if @innerHTML == @root.innerHTML
    delta = this._trackDelta( =>
      this.doSilently( =>
        @selection.preserve( =>
          lines = @doc.lines.toArray()
          lineNode = @root.firstChild
          _.each(lines, (line, index) =>
            while line.node != lineNode
              if line.node.parentNode == @root
                # New line inserted
                lineNode = Normalizer.normalizeLine(lineNode)
                newLine = @doc.insertLineBefore(lineNode, line)
                lineNode = lineNode.nextSibling
              else
                # Existing line removed
                return @doc.removeLine(line)
            if line.outerHTML != lineNode.outerHTML
              # Existing line changed
              line.node = Normalizer.normalizeLine(line.node)
              line.rebuild()
            lineNode = line.node.nextSibling
          )
          # New lines appended
          while lineNode != null
            lineNode = Normalizer.normalizeLine(lineNode)
            newLine = @doc.appendLine(lineNode)
            lineNode = lineNode.nextSibling
        )
        @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
      )
    )
    @innerHTML = @root.innerHTML
    return if delta.isIdentity() then false else delta


module.exports = Editor
