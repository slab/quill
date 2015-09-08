Quill        = require('../quill')
EventEmitter = require('eventemitter3')


class MultiCursor extends EventEmitter
  @DEFAULTS:
    template:
     '<span class="cursor-flag">\
        <span class="cursor-name"></span>\
      </span>\
      <span class="cursor-caret"></span>'
    timeout: 2500

  @events:
    CURSOR_ADDED: 'cursor-addded'
    CURSOR_MOVED: 'cursor-moved'
    CURSOR_REMOVED: 'cursor-removed'

  constructor: (@quill, @options) ->
    @cursors = {}
    @container = @quill.addContainer('ql-multi-cursor', true)
    @quill.on(@quill.constructor.events.TEXT_CHANGE, this._applyDelta, this)

  clearCursors: ->
    Object.keys(@cursors).forEach(this.removeCursor.bind(this))
    @cursors = {}

  moveCursor: (userId, index) ->
    cursor = @cursors[userId]
    cursor.index = index
    cursor.elem.classList.remove('hidden')
    clearTimeout(cursor.timer)
    cursor.timer = setTimeout( =>
      cursor.elem.classList.add('hidden')
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
    setTimeout( =>
      this.moveCursor(userId, index)
    , 0)
    return @cursors[userId]

  shiftCursors: (index, length, authorId = null) ->
    Object.keys(@cursors).forEach((id) =>
      return unless @cursors[id]
      shift = Math.max(length, index - @cursors[id].index)
      if @cursors[id].userId == authorId
        this.moveCursor(authorId, @cursors[id].index + shift)
      else if @cursors[id].index > index
        @cursors[id].index += shift
    )

  update: ->
    Object.keys(@cursors).forEach((id) =>
      this._updateCursor(@cursors[id]) if @cursors[id]?
    )

  _applyDelta: (delta) ->
    index = 0
    delta.ops.forEach((op) =>
      length = 0
      if op.insert?
        length = op.insert.length or 1
        this.shiftCursors(index, length, op.attributes?['author'])
      else if op.delete?
        this.shiftCursors(index, -1*op.delete, null)
      else if op.retain?
        this.shiftCursors(index, 0, null)
        length = op.retain
      index += length
    )
    this.update()

  _buildCursor: (name, color) ->
    cursor = document.createElement('span')
    cursor.classList.add('cursor')
    cursor.innerHTML = @options.template
    cursorFlag = cursor.querySelector('.cursor-flag')
    cursorName = cursor.querySelector('.cursor-name')
    cursorName.textContent = name
    cursorCaret = cursor.querySelector('.cursor-caret')
    cursorCaret.style.backgroundColor = cursorName.style.backgroundColor = color
    @container.appendChild(cursor)
    return cursor

  _updateCursor: (cursor) ->
    bounds = @quill.getBounds(cursor.index)
    return this.removeCursor(cursor.userId) unless bounds?
    cursor.elem.style.top = (bounds.top + @quill.container.scrollTop) + 'px'
    cursor.elem.style.left = bounds.left + 'px'
    cursor.elem.style.height = bounds.height + 'px'
    flag = cursor.elem.querySelector('.cursor-flag')
    isTop = parseInt(cursor.elem.style.top) <= flag.offsetHeight
    isLeft = parseInt(cursor.elem.style.top) <= flag.offsetHeight
    isRight = @quill.root.offsetWidth - parseInt(cursor.elem.style.left) <= flag.offsetWidth
    if cursor.elem.classList.contains('top') != isTop
      cursor.elem.classList.toggle('top')
    if cursor.elem.classList.contains('left') != isLeft
      cursor.elem.classList.toggle('left')
    if cursor.elem.classList.contains('right') != isRight
      cursor.elem.classList.toggle('right')
    this.emit(MultiCursor.events.CURSOR_MOVED, cursor)


Quill.registerModule('multi-cursor', MultiCursor)
module.exports = MultiCursor
