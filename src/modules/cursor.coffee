Scribe = require('../scribe')


_applyDelta = (delta) ->
  _.defer( =>
    delta.apply((index, text) =>
      this.shiftCursors(index, text.length)
    , (index, length) =>
      this.shiftCursors(index, -1 * length)
    , (index, length, name, value) =>
      this.shiftCursors(index, 0)
    )
  )

_buildCursor = (userId, name, color) ->
  cursor = @container.ownerDocument.createElement('span')
  cursor.setAttribute('contenteditable', false)
  cursor.classList.add('cursor')
  cursor.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
  cursor.id = Scribe.Editor.CURSOR_PREFIX + userId
  inner = @container.ownerDocument.createElement('span')
  inner.classList.add('cursor-inner')
  nameNode = @container.ownerDocument.createElement('span')
  nameNode.classList.add('cursor-name')
  nameNode.textContent = name
  inner.style['background-color'] = nameNode.style['background-color'] = color
  cursor.appendChild(nameNode)
  cursor.appendChild(inner)
  return cursor

_moveCursor = (cursorNode, referenceNode) ->
  cursorNode.style.top = referenceNode.offsetTop
  cursorNode.style.left = referenceNode.offsetLeft
  cursorNode.querySelector('.cursor-inner').style.height = referenceNode.offsetHeight

_setCursor = (userId, index, name, color) ->
  @cursors[userId] = { name: name, color: color, userId: userId } unless @cursors[userId]?
  @cursors[userId].index = index
  cursor = @container.querySelector("##{Scribe.Editor.CURSOR_PREFIX}#{userId}")
  unless cursor?
    cursor = _buildCursor.call(this, userId, name, color)
    @container.appendChild(cursor)
  @editor.doSilently( =>
    position = new Scribe.Position(@editor, index)
    span = @container.ownerDocument.createElement('span')
    span.textContent = Scribe.Constants.NOBREAK_SPACE
    if !position.leafNode.firstChild?
      position.leafNode.parentNode.insertBefore(span, position.leafNode)
      _moveCursor.call(this, cursor, span)
    else
      [leftText, rightText, didSplit] = Scribe.DOM.splitNode(position.leafNode.firstChild, position.offset)
      if rightText?
        rightText.parentNode.insertBefore(span, rightText)
        _moveCursor.call(this, cursor, span)
      else if leftText?
        leftText.parentNode.parentNode.appendChild(span)
        _moveCursor.call(this, cursor, span)
    span.parentNode.removeChild(span)
    position.leafNode.normalize() if didSplit
    if parseInt(cursor.style.top) <= 5
      cursor.classList.add('top')
    else
      cursor.classList.remove('top')
  )
  return cursor


class Scribe.MultiCursorManager
  @CURSOR_NAME_TIMEOUT: 2500

  constructor: (@editor) ->
    @cursors = {}
    @container = @editor.root.ownerDocument.createElement('div')
    @container.id = 'cursor-container'
    @container.style.top = @editor.root.offsetTop
    @container.style.left = @editor.root.offsetLeft
    @editor.root.parentNode.insertBefore(@container, @editor.root)
    @editor.renderer.addStyles({
      '#cursor-container': { 'position': 'absolute', 'z-index': '1000' }
      '.cursor': { 'display': 'inline-block', 'height': '12px', 'position': 'absolute', 'width': '0px' }
      '.cursor-name': {
        'font-family': "'Helvetica', 'Arial', san-serif"
        'font-size': '13px'
        'border-bottom-right-radius': '3px'
        'border-top-left-radius': '3px'
        'border-top-right-radius': '3px'
        'color': 'white'
        'display': 'inline-block'
        'left': '-1px'
        'line-height': '15px'
        'padding': '2px 8px'
        'position': 'absolute'
        'top': '-18px'
        'white-space': 'nowrap'
      }
      '.cursor.hidden .cursor-name': { 'display': 'none' }
      '.cursor-inner': { 'display': 'inline-block', 'width': '2px', 'position': 'absolute', 'height': '15px', 'left': '-1px' }
      '.cursor.top > .cursor-name': { 'border-top-left-radius': '0px', 'border-bottom-left-radius': '3px', 'top': '15px' }
    })
    @editor.on(Scribe.Editor.events.API_TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    )
    @editor.on(Scribe.Editor.events.TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    )

  shiftCursors: (index, length) ->
    _.each(@cursors, (cursor, id) =>
      return unless cursor?
      if (cursor.index >= index)
        if length > 0
          _setCursor.call(this, cursor.userId, cursor.index + length, cursor.name, cursor.color)   # Insert
        else
          # Delete needs to handle special case: start|cursor|end vs normal case: start|end|cursor
          _setCursor.call(this, cursor.userId, cursor.index + Math.max(length, index - cursor.index), cursor.name, cursor.color)
    )

  setCursor: (userId, index, name, color) ->
    cursor = _setCursor.call(this, userId, index, name, color)
    cursor.classList.remove('hidden')
    clearTimeout(@cursors[userId].timer)
    @cursors[userId].timer = setTimeout( =>
      cursor.classList.add('hidden')
      @cursors[userId].timer = null
    , Scribe.MultiCursorManager.CURSOR_NAME_TIMEOUT)

  clearCursors: ->
    while @container.firstChild?
      @container.removeChild(@container.firstChild)
    @cursors = {}

  removeCursor: (userId) ->
    cursor = @editor.root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    cursor.parentNode.removeChild(cursor) if cursor?


module.exports = Scribe
