_               = require('lodash')
EventEmitter2   = require('eventemitter2').EventEmitter2
ScribeDOM       = require('../dom')
ScribePosition  = require('../position')
ScribeRenderer  = require('../renderer')
ScribeUtils     = require('../utils')


_applyDelta = (delta) ->
  delta.apply((index, text, formatting) =>
    this.shiftCursors(index, text.length, formatting['author'], false)
  , (index, length) =>
    this.shiftCursors(index, -1 * length, null, false)
  , (index, length, name, value) =>
    this.shiftCursors(index, 0, null, false)
  )
  this.update()

_buildCursor = (name, color) ->
  cursor = @container.ownerDocument.createElement('span')
  ScribeDOM.addClass(cursor, 'cursor')
  cursor.innerHTML = @options.template
  cursorFlag = cursor.querySelector('.cursor-flag')
  cursorName = cursor.querySelector('.cursor-name')
  ScribeDOM.setText(cursorName, name)
  cursorCaret = cursor.querySelector('.cursor-caret')
  cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
  @container.appendChild(cursor)
  return cursor

_moveCursor = (cursor, referenceNode) ->
  cursor.elem.style.top = referenceNode.offsetTop + 'px'
  cursor.elem.style.left = referenceNode.offsetLeft + 'px'
  cursor.elem.style.height = referenceNode.offsetHeight + 'px'
  flag = cursor.elem.querySelector('.cursor-flag')
  ScribeDOM.toggleClass(cursor.elem, 'top', parseInt(cursor.elem.style.top) <= flag.offsetHeight)
  ScribeDOM.toggleClass(cursor.elem, 'left', parseInt(cursor.elem.style.left) <= flag.offsetWidth)
  ScribeDOM.toggleClass(cursor.elem, 'right', @editorContainer.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth)
  this.emit(ScribeMultiCursor.events.CURSOR_MOVED, cursor)

_updateCursor = (cursor) ->
  @scribe.editor.doSilently( =>
    position = new ScribePosition(@scribe.editor, cursor.index)
    guide = @container.ownerDocument.createElement('span')
    if !position.leafNode.firstChild?
      ScribeDOM.setText(guide, ScribeDOM.NOBREAK_SPACE)
      # Should only be the case for empty lines
      position.leafNode.parentNode.insertBefore(guide, position.leafNode)
      _moveCursor.call(this, cursor, guide)
    else
      ScribeDOM.setText(guide, ScribeDOM.ZERO_WIDTH_NOBREAK_SPACE)
      [leftText, rightText, didSplit] = ScribeUtils.splitNode(position.leafNode.firstChild, position.offset)
      if rightText?
        rightText.parentNode.insertBefore(guide, rightText)
        _moveCursor.call(this, cursor, guide)
      else if leftText?
        leftText.parentNode.appendChild(guide)
        _moveCursor.call(this, cursor, guide)
    guide.parentNode.removeChild(guide)
    ScribeDOM.normalize(position.leafNode) if didSplit
  )
  cursor.dirty = false


class ScribeMultiCursor extends EventEmitter2
  @DEFAULTS:
    template:
     '<span class="cursor-flag">
        <span class="cursor-name"></span>
      </span>
      <span class="cursor-caret"></span>'
    timeout: 2500

  @events:
    CURSOR_ADDED: 'cursor-addded'
    CURSOR_MOVED: 'cursor-moved'
    CURSOR_REMOVED: 'cursor-removed'

  constructor: (@scribe, @editorContainer, @options) ->
    @cursors = {}
    @container = @editorContainer.ownerDocument.createElement('div')
    @container.id = 'cursor-container'
    @scribe.editor.renderer.addContainer(@container, true)
    @scribe.editor.renderer.addStyles({
      '#cursor-container': { 'position': 'absolute', 'z-index': '1000' }
      '.cursor': { 'margin-left': '-1px', 'position': 'absolute' }
      '.cursor-flag':
        'bottom': '100%'
        'position': 'absolute'
        'white-space': 'nowrap'
      '.cursor-name':
        'display': 'inline-block'
        'color': 'white'
        'padding': '2px 8px'
      '.cursor-caret':
        'height': '100%'
        'position': 'absolute'
        'width': '2px'
      '.cursor.hidden .cursor-flag': { 'display': 'none' }
      '.cursor.top > .cursor-flag': { 'bottom': 'auto', 'top': '100%' }
      '.cursor.right > .cursor-flag': { 'right': '-2px' }
    })
    @scribe.editor.renderer.on(ScribeRenderer.events.UPDATE, =>
      _.defer( =>
        @container.style.top = @editorContainer.offsetTop + 'px'
        @container.style.left = @editorContainer.offsetLeft  + 'px'
        this.update(true)
      )
    )
    @scribe.on(@scribe.constructor.events.TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    )

  clearCursors: ->
    _.each(_.keys(@cursors), (id) =>
      this.removeCursor(id)
    )
    @cursors = {}

  moveCursor: (userId, index, update = true) ->
    cursor = @cursors[userId]
    cursor.index = index
    cursor.dirty = true
    ScribeDOM.removeClass(cursor.elem, 'hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      ScribeDOM.addClass(cursor.elem, 'hidden')
      cursor.timer = null
    , @options.timeout)
    _updateCursor.call(this, cursor) if update
    return cursor

  removeCursor: (userId) ->
    cursor = @cursors[userId]
    this.emit(ScribeMultiCursor.events.CURSOR_REMOVED, cursor)
    cursor.elem.parentNode.removeChild(cursor.elem) of cursor?
    delete @cursors[userId]

  setCursor: (userId, index, name, color, update = true) ->
    unless @cursors[userId]?
      @cursors[userId] = cursor = {
        userId: userId
        index: index
        color: color
        elem: _buildCursor.call(this, name, color)
      }
      this.emit(ScribeMultiCursor.events.CURSOR_ADDED, cursor)
    return this.moveCursor(userId, index, update)

  shiftCursors: (index, length, authorId = null, update = true) ->
    _.each(@cursors, (cursor, id) =>
      return unless cursor and (cursor.index > index or cursor.userId == authorId)
      cursor.index += Math.max(length, index - cursor.index)
      cursor.dirty = true
    )
    this.update() if update

  update: (force = false) ->
    _.each(@cursors, (cursor, id) =>
      return unless cursor?
      _updateCursor.call(this, cursor) if cursor.dirty or force
    )


module.exports = ScribeMultiCursor
