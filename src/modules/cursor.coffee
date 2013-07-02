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
  Scribe.DOM.addClass(cursor, 'cursor')
  cursor.id = Scribe.MultiCursor.ID_PREFIX + userId
  inner = @container.ownerDocument.createElement('span')
  Scribe.DOM.addClass(inner, 'cursor-inner')
  nameNode = @container.ownerDocument.createElement('span')
  Scribe.DOM.addClass(nameNode, 'cursor-name')
  nameNode.textContent = name
  inner.style.backgroundColor = nameNode.style.backgroundColor = color
  cursor.appendChild(nameNode)
  cursor.appendChild(inner)
  return cursor

_moveCursor = (cursor, referenceNode) ->
  cursor.elem.style.top = referenceNode.offsetTop
  cursor.elem.style.left = referenceNode.offsetLeft
  cursorInner = cursor.elem.querySelector('.cursor-inner')
  cursorInner.style.height = referenceNode.offsetHeight
  if parseInt(cursor.elem.style.top) <= 5
    Scribe.DOM.addClass(cursor.elem, 'top')
  else
    Scribe.DOM.removeClass(cursor.elem, 'top')

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
        leftText.parentNode.appendChild(span)
        _moveCursor.call(this, @cursors[userId], span)
    span.parentNode.removeChild(span)
    position.leafNode.normalize() if didSplit
  )
  return @cursors[userId]


class Scribe.MultiCursor
  @CURSOR_NAME_TIMEOUT: 2500
  @ID_PREFIX: 'cursor-'

  constructor: (@editor) ->
    @cursors = {}
    @container = @editor.root.ownerDocument.createElement('div')
    @container.id = 'cursor-container'
    @editor.renderer.addContainer(@container, true)
    @editor.renderer.runWhenLoaded( =>
      _.defer( =>
        @container.style.top = @editor.root.offsetTop
        @container.style.left = @editor.root.offsetLeft
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
            'line-height': '1.154'
            'padding': '2px 8px'
            'position': 'absolute'
            'top': '-18px'
            'white-space': 'nowrap'
          }
          '.cursor.hidden .cursor-name': { 'display': 'none' }
          '.cursor-inner': { 'display': 'inline-block', 'width': '2px', 'position': 'absolute', 'height': '15px', 'left': '-1px' }
          '.cursor.top > .cursor-name': { 'border-top-left-radius': '0px', 'border-bottom-left-radius': '3px', 'top': '15px' }
        })
      )
    )
    this.initListeners()

  initListeners: ->
    @editor.applyDelta = _.wrap(@editor.applyDelta, (applyDelta, delta, options) =>
      applyDelta.call(@editor, delta, options)
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
    Scribe.DOM.removeClass(cursor.elem, 'hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      Scribe.DOM.addClass(cursor.elem, 'hidden')
      cursor.timer = null
    , Scribe.MultiCursor.CURSOR_NAME_TIMEOUT)

  clearCursors: ->
    while @container.firstChild?
      @container.removeChild(@container.firstChild)
    @cursors = {}

  removeCursor: (userId) ->
    cursor = @editor.root.ownerDocument.getElementById(Scribe.MultiCursor.ID_PREFIX + userId)
    cursor.parentNode.removeChild(cursor) if cursor?


module.exports = Scribe
