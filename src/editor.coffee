_          = require('lodash')
DOM        = require('./dom')
Document   = require('./document')
Line       = require('./line')
Renderer   = require('./renderer')
Selection  = require('./selection')
Tandem     = require('tandem-core')


class Editor
  constructor: (@iframeContainer, @quill, @options = {}) ->
    @renderer = new Renderer(@iframeContainer, @options)
    @root = @renderer.root
    @doc = new Document(@root, @options)
    @delta = @doc.toDelta()
    @selection = new Selection(@doc, @quill)
    @timer = setInterval(_.bind(this.checkUpdate, this), @options.pollInterval)
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, (range) =>
      @savedRange = range
    )
    this.enable() unless @options.readOnly

  disable: ->
    this.enable(false)

  enable: (enabled = true) ->
    @root.setAttribute('contenteditable', enabled)

  applyDelta: (delta, source) ->
    localDelta = this._update()
    if localDelta
      tempDelta = localDelta
      localDelta = localDelta.transform(delta, true)
      delta = delta.transform(tempDelta, false)
      @delta = @doc.toDelta()   # Only for our error check below, otherwise dont need to update yet
    unless delta.isIdentity()   # Follows may have turned delta into the identity
      if delta.startLength != @delta.endLength
        console.warn("Trying to apply delta to incorrect doc length", delta, @delta)
      delta = this._trackDelta( =>
        delta.apply(this._insertAt, this._deleteAt, this._formatAt, this)
        @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
      )
      @delta = @doc.toDelta()
      @innerHTML = @root.innerHTML
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, source) if delta and source != 'silent'
    if localDelta and !localDelta.isIdentity() and source != 'silent'
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, localDelta, 'user')

  checkUpdate: (source = 'user') ->
    return clearInterval(@timer) if !@renderer.iframe.parentNode? or !@root.parentNode?
    delta = this._update()
    if delta
      oldDelta = @delta
      @delta = oldDelta.compose(delta)
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, source)
    source = 'silent' if delta
    @selection.update(source)

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
        formatLength = Math.min(length, line.length - offset - 1)
        line.formatText(offset, formatLength, name, value)
        length -= formatLength
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
      _.each(lineTexts, (lineText, i) =>
        if !line? or line.length <= offset    # End of document
          if i < lineTexts.length - 1 or lineText.length > 0
            line = @doc.appendLine(@root.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG))
            offset = 0
            line.insertText(offset, lineText, formatting)
            line.format(formatting)
            nextLine = null
        else
          line.insertText(offset, lineText, formatting)
          if i < lineTexts.length - 1       # Are there more lines to insert?
            nextLine = @doc.splitLine(line, offset + lineText.length)
            line.format(formatting)
            offset = 0
        line = nextLine
      )
    )

  _trackDelta: (fn) ->
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
      # Choose delta with fewest insertions
      [lengthA, lengthB] = _.map([decomposeA, decomposeB], (delta) ->
        return _.reduce(delta.ops, (count, op) ->
          count += op.value.length if op.value?
          return count
        , 0)
      )
      decompose = if lengthA < lengthA then decomposeA else decomposeB
    else
      decompose = decomposeA or decomposeB
    return decompose

  _update: ->
    return false if @innerHTML == @root.innerHTML
    delta = this._trackDelta( =>
      @selection.preserve(_.bind(@doc.rebuild, @doc))
      @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
    )
    @innerHTML = @root.innerHTML
    return if delta.isIdentity() then false else delta


module.exports = Editor
