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
  @editor.doSilently( =>
    @cursors[userId] = { name: name, color: color, userId: userId } unless @cursors[userId]?
    @cursors[userId].index = index
    cursor = @container.querySelector("##{Scribe.Editor.CURSOR_PREFIX}#{userId}")
    if cursor?
      cursor.querySelector('.cursor-name').classList.remove('hidden')
    else
      cursor = _buildCursor.call(this, userId, name, color)
      @container.appendChild(cursor)
    position = new Scribe.Position(@editor, index)
    if !position.leafNode.firstChild?
      _moveCursor.call(this, cursor, position.leafNode.parentNode)
    else
      [leftText, rightText, didSplit] = Scribe.DOM.splitNode(position.leafNode.firstChild, position.offset)
      if rightText?
        span = @container.ownerDocument.createElement('span')
        Scribe.DOM.wrap(span, rightText)
        _moveCursor.call(this, cursor, span)
        Scribe.DOM.unwrap(span)
      else if leftText?
        span = @container.ownerDocument.createElement('span')
        leftText.parentNode.parentNode.appendChild(span)
        _moveCursor.call(this, cursor, span)
        span.parentNode.removeChild(span)
      position.leafNode.normalize() if didSplit
    if parseInt(cursor.style.top) <= 5
      cursor.classList.add('top')
    else
      cursor.classList.remove('top')
  )


class Scribe.MultiCursorManager
  @CURSOR_NAME_TIMEOUT: 5000

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
      '.cursor-name.hidden': { 'display': 'none' }
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
      return if cursor == undefined || cursor.index < index
      if (cursor.index >= index)
        if length > 0
          _setCursor.call(this, cursor.userId, cursor.index + length, cursor.name, cursor.color)   # Insert
        else
          # Delete needs to handle special case: start|cursor|end vs normal case: start|end|cursor
          _setCursor.call(this, cursor.userId, cursor.index + Math.max(length, index - cursor.index), cursor.name, cursor.color)
    )

  setCursor: (userId, index, name, color) ->
    _setCursor.call(this, userId, index, name, color)
    clearTimeout(@cursors[userId].timer)
    @cursors[userId].timer = setTimeout( =>
      cursorName = @container.querySelector("##{Scribe.Editor.CURSOR_PREFIX}#{userId} .cursor-name")
      cursorName.classList.add('hidden') if cursorName
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
