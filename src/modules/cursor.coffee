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
  cursorFlag = cursor.querySelector('.cursor-flag')
  cursorName = cursor.querySelector('.cursor-name')
  Scribe.DOM.setText(cursorName, name)
  cursorCaret = cursor.querySelector('.cursor-caret')
  cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
  @container.appendChild(cursor)
  return cursor

_moveCursor = (cursor, referenceNode) ->
  cursor.elem.style.top = referenceNode.offsetTop
  cursor.elem.style.left = referenceNode.offsetLeft
  cursor.elem.style.height = referenceNode.offsetHeight
  if parseInt(cursor.elem.style.top) < parseInt(cursor.elem.style.height)
    Scribe.DOM.addClass(cursor.elem, 'top')
  else
    Scribe.DOM.removeClass(cursor.elem, 'top')

_updateCursor = (cursor) ->
  @editor.doSilently( =>
    position = new Scribe.Position(@editor, cursor.index)
    guide = @container.ownerDocument.createElement('span')
    if !position.leafNode.firstChild?
      Scribe.DOM.setText(guide, Scribe.DOM.NOBREAK_SPACE)
      # Should only be the case for empty lines
      position.leafNode.parentNode.insertBefore(guide, position.leafNode)
      _moveCursor.call(this, cursor, guide)
    else
      Scribe.DOM.setText(guide, Scribe.DOM.ZERO_WIDTH_NOBREAK_SPACE)
      [leftText, rightText, didSplit] = Scribe.Utils.splitNode(position.leafNode.firstChild, position.offset)
      if rightText?
        rightText.parentNode.insertBefore(guide, rightText)
        _moveCursor.call(this, cursor, guide)
      else if leftText?
        leftText.parentNode.appendChild(guide)
        _moveCursor.call(this, cursor, guide)
    guide.parentNode.removeChild(guide)
    Scribe.DOM.normalize(position.leafNode) if didSplit
  )
  cursor.dirty = false


class Scribe.MultiCursor
  @DEFAULTS:
    template: 
     '<span class="cursor-flag">
        <span class="cursor-name"></span>
      </span>
      <span class="cursor-caret"></span>'
    timeout: 2500

  constructor: (@editor, options = {}) ->
    @options = _.defaults(options, Scribe.MultiCursor.DEFAULTS)
    @cursors = {}
    @container = @editor.root.ownerDocument.createElement('div')
    @container.id = 'cursor-container'
    @editor.renderer.addContainer(@container, true)
    @editor.renderer.addStyles({
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
    return cursor

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
