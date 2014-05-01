_             = require('lodash')
EventEmitter2 = require('eventemitter2').EventEmitter2
DOM           = require('../dom')
Utils         = require('../utils')


class MultiCursor extends EventEmitter2
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

  constructor: (@quill, @options) ->
    @cursors = {}
    @container = @quill.addContainer('cursor-container', true)
    @quill.addStyles(
      '.cursor-container': { 'position': 'absolute', 'z-index': '1000' }
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
    )
    @quill.on(@quill.constructor.events.RENDER_UPDATE, =>
      _.defer( =>
        @container.style.top = @quill.root.offsetTop + 'px'
        @container.style.left = @quill.root.offsetLeft  + 'px'
        this.update(true)
      )
    )
    @quill.on(@quill.constructor.events.TEXT_CHANGE, _.bind(this._applyDelta, this))

  clearCursors: ->
    _.each(_.keys(@cursors), _.bind(this.removeCursor, this))
    @cursors = {}

  moveCursor: (userId, index, update = true) ->
    cursor = @cursors[userId]
    cursor.index = index
    cursor.dirty = true
    DOM.removeClass(cursor.elem, 'hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      DOM.addClass(cursor.elem, 'hidden')
      cursor.timer = null
    , @options.timeout)
    this._updateCursor(cursor) if update
    return cursor

  removeCursor: (userId) ->
    cursor = @cursors[userId]
    this.emit(MultiCursor.events.CURSOR_REMOVED, cursor)
    cursor.elem.parentNode.removeChild(cursor.elem) of cursor?
    delete @cursors[userId]

  setCursor: (userId, index, name, color, update = true) ->
    unless @cursors[userId]?
      @cursors[userId] = cursor = {
        userId: userId
        index: index
        color: color
        elem: this._buildCursor(name, color)
      }
      this.emit(MultiCursor.events.CURSOR_ADDED, cursor)
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
      this._updateCursor(cursor) if cursor.dirty or force
    )

  _applyDelta: (delta) ->
    delta.apply((index, text, formatting) =>
      this.shiftCursors(index, text.length, formatting['author'], false)
    , (index, length) =>
      this.shiftCursors(index, -1 * length, null, false)
    , (index, length, name, value) =>
      this.shiftCursors(index, 0, null, false)
    )
    this.update()

  _buildCursor: (name, color) ->
    cursor = @container.ownerDocument.createElement('span')
    DOM.addClass(cursor, 'cursor')
    cursor.innerHTML = @options.template
    cursorFlag = cursor.querySelector('.cursor-flag')
    cursorName = cursor.querySelector('.cursor-name')
    DOM.setText(cursorName, name)
    cursorCaret = cursor.querySelector('.cursor-caret')
    cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
    @container.appendChild(cursor)
    return cursor

  _moveCursor: (cursor, referenceNode) ->
    cursor.elem.style.top = referenceNode.offsetTop + 'px'
    cursor.elem.style.left = referenceNode.offsetLeft + 'px'
    cursor.elem.style.height = referenceNode.offsetHeight + 'px'
    flag = cursor.elem.querySelector('.cursor-flag')
    DOM.toggleClass(cursor.elem, 'top', parseInt(cursor.elem.style.top) <= flag.offsetHeight)
    DOM.toggleClass(cursor.elem, 'left', parseInt(cursor.elem.style.left) <= flag.offsetWidth)
    DOM.toggleClass(cursor.elem, 'right', @quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth)
    this.emit(MultiCursor.events.CURSOR_MOVED, cursor)

  _updateCursor: (cursor) ->
    [leaf, offset] = @quill.editor.doc.findLeafAt(cursor.index)
    guide = @container.ownerDocument.createElement('span')
    if leaf?
      leafNode = leaf.node
      if !leafNode.firstChild?
        DOM.setText(guide, DOM.NOBREAK_SPACE)
        # Should only be the case for empty lines
        leafNode.parentNode.insertBefore(guide, leafNode)
        this._moveCursor(cursor, guide)
      else
        DOM.setText(guide, DOM.ZERO_WIDTH_NOBREAK_SPACE)
        [leftText, rightText, didSplit] = Utils.splitNode(leafNode.firstChild, offset)
        if rightText?
          rightText.parentNode.insertBefore(guide, rightText)
          this._moveCursor(cursor, guide)
        else if leftText?
          leftText.parentNode.appendChild(guide)
          this._moveCursor(cursor, guide)
    else
      DOM.setText(guide, DOM.NOBREAK_SPACE)
      @quill.root.appendChild(guide)
      this._moveCursor(cursor, guide)
    guide.parentNode.removeChild(guide)
    DOM.normalize(leafNode) if didSplit
    cursor.dirty = false


module.exports = MultiCursor
