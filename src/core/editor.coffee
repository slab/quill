_         = require('lodash')
Delta     = require('rich-text/lib/delta')
dom       = require('../lib/dom')
Document  = require('./document')
Line      = require('./line')
Selection = require('./selection')


class Editor
  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'

  constructor: (@root, @quill, @options = {}) ->
    @root.setAttribute('id', @options.id)
    @doc = new Document(@root, @options)
    @delta = @doc.toDelta()
    @length = @delta.length()
    @selection = new Selection(@doc, @quill)
    @timer = setInterval(_.bind(this.checkUpdate, this), @options.pollInterval)
    @savedRange = null;
    @quill.on("selection-change", (range) =>
      @savedRange = range
    )
    this.enable() unless @options.readOnly

  destroy: ->
    clearInterval(@timer)

  disable: ->
    this.enable(false)

  enable: (enabled = true) ->
    @root.setAttribute('contenteditable', enabled)

  applyDelta: (delta, source) ->
    localDelta = this._update()
    if localDelta
      delta = localDelta.transform(delta, true)
      localDelta = delta.transform(localDelta, false)
    if delta.ops.length > 0
      delta = this._trackDelta( =>
        index = 0
        _.each(delta.ops, (op) =>
          if _.isString(op.insert)
            this._insertAt(index, op.insert, op.attributes)
            index += op.insert.length;
          else if _.isNumber(op.insert)
            this._insertEmbed(index, op.attributes)
            index += 1;
          else if _.isNumber(op.delete)
            this._deleteAt(index, op.delete)
          else if _.isNumber(op.retain)
            _.each(op.attributes, (value, name) =>
              this._formatAt(index, op.retain, name, value)
            )
            index += op.retain
        )
        @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
      )
      @delta = @doc.toDelta()
      @length = @delta.length()
      @innerHTML = @root.innerHTML
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, source) if delta and source != Editor.sources.SILENT
    if localDelta and localDelta.ops.length > 0 and source != Editor.sources.SILENT
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, localDelta, Editor.sources.USER)

  checkUpdate: (source = 'user') ->
    return clearInterval(@timer) unless @root.parentNode?
    delta = this._update()
    if delta
      @delta = @delta.compose(delta)
      @length = @delta.length()
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, source)
    source = Editor.sources.SILENT if delta
    @selection.update(source)

  focus: ->
    if @selection.range?
      @selection.setRange(@selection.range)
    else
      @root.focus()

  getBounds: (index) ->
    this.checkUpdate()
    [leaf, offset] = @doc.findLeafAt(index, true)
    return null unless leaf?
    containerBounds = @root.parentNode.getBoundingClientRect()
    side = 'left'
    if leaf.length == 0   # BR case
      bounds = leaf.node.parentNode.getBoundingClientRect()
    else if dom.VOID_TAGS[leaf.node.tagName]
      bounds = leaf.node.getBoundingClientRect()
      side = 'right' if offset == 1
    else
      range = document.createRange()
      if offset < leaf.length
        range.setStart(leaf.node, offset)
        range.setEnd(leaf.node, offset + 1)
      else
        range.setStart(leaf.node, offset - 1)
        range.setEnd(leaf.node, offset)
        side = 'right'
      bounds = range.getBoundingClientRect()
    return {
      height: bounds.height
      left: bounds[side] - containerBounds.left
      top: bounds.top - containerBounds.top
    }

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

  _insertEmbed: (index, attributes) ->
    @selection.shiftAfter(index, 1, =>
      [line, offset] = @doc.findLineAt(index)
      line.insertEmbed(offset, attributes)
    )

  _insertAt: (index, text, formatting = {}) ->
    @selection.shiftAfter(index, text.length, =>
      text = text.replace(/\r\n?/g, '\n')
      lineTexts = text.split('\n')
      [line, offset] = @doc.findLineAt(index)
      _.each(lineTexts, (lineText, i) =>
        if !line? or line.length <= offset    # End of document
          if i < lineTexts.length - 1 or lineText.length > 0
            line = @doc.appendLine(document.createElement(dom.DEFAULT_BLOCK_TAG))
            offset = 0
            line.insertText(offset, lineText, formatting)
            line.format(formatting)
            nextLine = null
        else
          line.insertText(offset, lineText, formatting)
          if i < lineTexts.length - 1       # Are there more lines to insert?
            nextLine = @doc.splitLine(line, offset + lineText.length)
            _.each(_.defaults({}, formatting, line.formats), (value, format) ->
              line.format(format, formatting[format])
            )
            offset = 0
        line = nextLine
      )
    )

  _trackDelta: (fn) ->
    oldIndex = @savedRange?.start
    fn()
    newDelta = @doc.toDelta()
    @savedRange = @selection.getRange()
    newIndex = @savedRange?.start
    try
      if oldIndex? and newIndex? and oldIndex <= @delta.length() and newIndex <= newDelta.length()
        oldRightDelta = @delta.slice(oldIndex)
        newRightDelta = newDelta.slice(newIndex)
        if _.isEqual(oldRightDelta.ops, newRightDelta.ops)
          oldLeftDelta = @delta.slice(0, oldIndex)
          newLeftDelta = newDelta.slice(0, newIndex)
          return oldLeftDelta.diff(newLeftDelta)
    catch ignored
    return @delta.diff(newDelta)

  _update: ->
    return false if @innerHTML == @root.innerHTML
    delta = this._trackDelta( =>
      @selection.preserve(_.bind(@doc.rebuild, @doc))
      @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
    )
    @innerHTML = @root.innerHTML
    return if delta.ops.length > 0 then delta else false


module.exports = Editor
