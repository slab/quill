Quill         = require('../quill')
EventEmitter2 = require('eventemitter2').EventEmitter2
_             = Quill.require('lodash')
dom           = Quill.require('dom')


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
      '.cursor-container': { 'position': 'absolute', 'left': '0', 'top': '0', 'z-index': '1000' }
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
    @quill.on(@quill.constructor.events.TEXT_CHANGE, _.bind(this._applyDelta, this))

  clearCursors: ->
    _.each(_.keys(@cursors), _.bind(this.removeCursor, this))
    @cursors = {}

  moveCursor: (userId, index) ->
    cursor = @cursors[userId]
    cursor.index = index
    dom(cursor.elem).removeClass('hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      dom(cursor.elem).addClass('hidden')
      cursor.timer = null
    , @options.timeout)
    this._updateCursor(cursor)
    return cursor

  removeCursor: (userId) ->
    cursor = @cursors[userId]
    this.emit(MultiCursor.events.CURSOR_REMOVED, cursor)
    cursor.elem.parentNode.removeChild(cursor.elem) if cursor?
    delete @cursors[userId]

  setCursor: (userId, index, name, color) ->
    unless @cursors[userId]?
      @cursors[userId] = cursor = {
        userId: userId
        index: index
        color: color
        elem: this._buildCursor(name, color)
      }
      this.emit(MultiCursor.events.CURSOR_ADDED, cursor)
    _.defer( =>
      this.moveCursor(userId, index)
    )
    return @cursors[userId]

  shiftCursors: (index, length, authorId = null) ->
    _.each(@cursors, (cursor, id) =>
      return unless cursor and (cursor.index > index or cursor.userId == authorId)
      cursor.index += Math.max(length, index - cursor.index)
    )

  update: ->
    _.each(@cursors, (cursor, id) =>
      return unless cursor?
      this._updateCursor(cursor)
      return true
    )

  _applyDelta: (delta) ->
    delta.apply((index, text, formatting) =>
      this.shiftCursors(index, text.length, formatting['author'])
    , (index, length) =>
      this.shiftCursors(index, -1 * length, null)
    , (index, length, name, value) =>
      this.shiftCursors(index, 0, null)
    )
    this.update()

  _buildCursor: (name, color) ->
    cursor = @container.ownerDocument.createElement('span')
    dom(cursor).addClass('cursor')
    cursor.innerHTML = @options.template
    cursorFlag = cursor.querySelector('.cursor-flag')
    cursorName = cursor.querySelector('.cursor-name')
    dom(cursorName).setText(name)
    cursorCaret = cursor.querySelector('.cursor-caret')
    cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
    @container.appendChild(cursor)
    return cursor

  _moveCursor: (cursor, reference, side = 'left') ->
    bounds = reference.getBoundingClientRect()
    cursor.elem.style.top = bounds.top + 'px'
    cursor.elem.style.left = bounds[side] + 'px'
    cursor.elem.style.height = bounds.height + 'px'
    flag = cursor.elem.querySelector('.cursor-flag')
    dom(cursor.elem).toggleClass('top', parseInt(cursor.elem.style.top) <= flag.offsetHeight)
                    .toggleClass('left', parseInt(cursor.elem.style.left) <= flag.offsetWidth)
                    .toggleClass('right', @quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth)
    this.emit(MultiCursor.events.CURSOR_MOVED, cursor)

  _updateCursor: (cursor) ->
    @quill.editor.checkUpdate()
    [leaf, offset] = @quill.editor.doc.findLeafAt(cursor.index, true)
    guide = @container.ownerDocument.createElement('span')
    if leaf?
      [leftNode, rightNode, didSplit] = dom(leaf.node).splitNode(offset)
      dom(guide).setText(dom.ZERO_WIDTH_NOBREAK_SPACE)
      leaf.node.parentNode.insertBefore(guide, rightNode)
    else
      dom(guide).setText(dom.NOBREAK_SPACE)
      @quill.root.appendChild(guide)
    this._moveCursor(cursor, guide)
    dom(guide).removeNode()
    dom(leaf.node.parentNode).normalize() if didSplit
    @quill.editor.selection.update('silent')


Quill.registerModule('multi-cursor', MultiCursor)
module.exports = MultiCursor
