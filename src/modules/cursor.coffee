Scribe = require('../scribe')


_applyDelta = (delta) ->
  _.defer( =>
    delta.apply((index, text, formatting) =>
      this.shiftCursors(index, text.length, formatting['author'])
    , (index, length) =>
      this.shiftCursors(index, -1 * length)
    , (index, length, name, value) =>
      this.shiftCursors(index, 0)
    )
  )

_buildCursor = (userId, name, color) ->
  cursor = @container.ownerDocument.createElement('span')
  cursor.classList.add('cursor')
  cursor.classList.add(Scribe.DOM.EXTERNAL_CLASS)
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

_moveCursor = (cursor, referenceNode) ->
  cursor.elem.style.top = referenceNode.offsetTop
  cursor.elem.style.left = referenceNode.offsetLeft
  cursor.elem.querySelector('.cursor-inner').style.height = referenceNode.offsetHeight
  if parseInt(cursor.elem.style.top) <= 5
    cursor.elem.classList.add('top')
  else
    cursor.elem.classList.remove('top')

_setCursor = (userId, index, name, color) ->
  unless @cursors[userId]?
    @cursors[userId] = { name: name, color: color, userId: userId }
    @cursors[userId].elem = _buildCursor.call(this, userId, name, color)
    @container.appendChild(@cursors[userId].elem)
  @cursors[userId].index = index
  @editor.doSilently( =>
    position = new Scribe.Position(@editor, index)
    span = @container.ownerDocument.createElement('span')
    span.textContent = Scribe.DOM.NOBREAK_SPACE
    if !position.leafNode.firstChild?
      position.leafNode.parentNode.insertBefore(span, position.leafNode)
      _moveCursor.call(this, @cursors[userId], span)
    else
      [leftText, rightText, didSplit] = Scribe.DOM.splitNode(position.leafNode.firstChild, position.offset)
      if rightText?
        rightText.parentNode.insertBefore(span, rightText)
        _moveCursor.call(this, @cursors[userId], span)
      else if leftText?
        leftText.parentNode.parentNode.appendChild(span)
        _moveCursor.call(this, @cursors[userId], span)
    span.parentNode.removeChild(span)
    position.leafNode.normalize() if didSplit
  )
  return @cursors[userId]


class Scribe.MultiCursor
  @CURSOR_NAME_TIMEOUT: 2500

  constructor: (@editor) ->
    @cursors = {}
    @container = @editor.root.ownerDocument.createElement('div')
    @container.id = 'cursor-container'
    @container.style.top = @editor.root.offsetTop
    @container.style.left = @editor.root.offsetLeft
    @editor.renderer.addContainer(@container, true)
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
    this.initListeners()

  initListeners: ->
    @editor.on(Scribe.Editor.events.API_TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    )
    @editor.on(Scribe.Editor.events.TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    )

  shiftCursors: (index, length, authorId) ->
    _.each(@cursors, (cursor, id) =>
      if cursor and cursor.index > index
        # Needs to handle special case: start|cursor|end vs normal case: start|end|cursor
        _setCursor.call(this, cursor.userId, cursor.index + Math.max(length, index - cursor.index), cursor.name, cursor.color)
    )
    cursor = @cursors[authorId]
    _setCursor.call(this, cursor.userId, index + length, cursor.name, cursor.color) if cursor?

  setCursor: (userId, index, name, color) ->
    cursor = _setCursor.call(this, userId, index, name, color)
    cursor.elem.classList.remove('hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      cursor.elem.classList.add('hidden')
      cursor.timer = null
    , Scribe.MultiCursor.CURSOR_NAME_TIMEOUT)

  clearCursors: ->
    while @container.firstChild?
      @container.removeChild(@container.firstChild)
    @cursors = {}

  removeCursor: (userId) ->
    cursor = @editor.root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    cursor.parentNode.removeChild(cursor) if cursor?


module.exports = Scribe
