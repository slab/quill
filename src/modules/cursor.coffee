Scribe = require('../scribe')


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
  Scribe.DOM.addClass(cursor, 'cursor')
  cursor.innerHTML = @options.template
  cursorName = cursor.querySelector('.cursor-name')
  cursorName.textContent = name
  cursorCaret = cursor.querySelector('.cursor-caret')
  cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
  @container.appendChild(cursor)
  return cursor

_moveCursor = (cursor, referenceNode) ->
  cursor.elem.style.top = referenceNode.offsetTop
  cursor.elem.style.left = referenceNode.offsetLeft
  cursor.elem.style.height = referenceNode.offsetHeight
  if parseInt(cursor.elem.style.top) <= parseInt(cursor.elem.style.height)
    Scribe.DOM.addClass(cursor.elem, 'top')
  else
    Scribe.DOM.removeClass(cursor.elem, 'top')

_updateCursor = (cursor) ->
  @editor.doSilently( =>
    position = new Scribe.Position(@editor, cursor.index)
    span = @container.ownerDocument.createElement('span')
    span.textContent = Scribe.DOM.NOBREAK_SPACE
    if !position.leafNode.firstChild?
      position.leafNode.parentNode.insertBefore(span, position.leafNode)
      _moveCursor.call(this, cursor, span)
    else
      [leftText, rightText, didSplit] = Scribe.DOM.splitNode(position.leafNode.firstChild, position.offset)
      if rightText?
        rightText.parentNode.insertBefore(span, rightText)
        _moveCursor.call(this, cursor, span)
      else if leftText?
        leftText.parentNode.appendChild(span)
        _moveCursor.call(this, cursor, span)
    span.parentNode.removeChild(span)
    Scribe.DOM.normalize(position.leafNode) if didSplit
  )
  cursor.dirty = false


class Scribe.MultiCursor
  @DEFAULTS:
    template: '<span class="cursor-name"></span><span class="cursor-caret"></span>'
    timeout: 2500

  constructor: (@editor, options = {}) ->
    @options = _.defaults(options, Scribe.MultiCursor.DEFAULTS)
    @cursors = {}
    @container = @editor.root.ownerDocument.createElement('div')
    @container.id = 'cursor-container'
    @editor.renderer.addContainer(@container, true)
    @editor.renderer.addStyles({
      '#cursor-container': { 'position': 'absolute', 'z-index': '1000' }
      '.cursor': { 'display': 'inline-block', 'height': '15px', 'position': 'absolute', 'width': '0px' }
      '.cursor-name': {
        'font-family': "'Helvetica', 'Arial', san-serif"
        'font-size': '13px'
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
      '.cursor-caret': { 'display': 'inline-block', 'width': '2px', 'position': 'absolute', 'height': '100%', 'left': '-1px' }
      '.cursor.top > .cursor-name': { 'top': '100%' }
    })
    @editor.renderer.on(Scribe.Renderer.events.UPDATE, =>
      _.defer( =>
        @container.style.top = @editor.root.offsetTop
        @container.style.left = @editor.root.offsetLeft
      )
    )
    this.initListeners()

  initListeners: ->
    @editor.on(Scribe.Editor.events.API_TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    ).on(Scribe.Editor.events.USER_TEXT_CHANGE, (delta) =>
      _applyDelta.call(this, delta)
    )

  shiftCursors: (index, length, authorId = null, update = true) ->
    _.each(@cursors, (cursor, id) =>
      return unless cursor and (cursor.index > index or cursor.userId == authorId)
      cursor.index += Math.max(length, index - cursor.index)
      cursor.dirty = true
    )
    this.update() if update

  setCursor: (userId, index, name, color, update = true) ->
    cursor = @cursors[userId]
    unless cursor?
      @cursors[userId] = cursor = {
        userId: userId
        index: index
        elem: _buildCursor.call(this, name, color)
      }
    cursor.index = index
    cursor.dirty = true
    Scribe.DOM.removeClass(cursor.elem, 'hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      Scribe.DOM.addClass(cursor.elem, 'hidden')
      cursor.timer = null
    , @options.timeout)
    _updateCursor.call(this, cursor) if update

  clearCursors: ->
    _.each(_.keys(@cursors), (id) =>
      this.removeCursor(id)
    )
    @cursors = {}

  removeCursor: (userId) ->
    cursor = @cursors[userId]
    cursor.elem.parentNode.removeChild(cursor.elem) of cursor?
    delete @cursors[userId]

  update: ->
    _.each(@cursors, (cursor, id) =>
      _updateCursor.call(this, cursor) if cursor?.dirty
    )


module.exports = Scribe
