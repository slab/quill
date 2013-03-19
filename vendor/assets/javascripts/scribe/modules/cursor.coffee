buildCursor = (userId, index, name, color) ->
  cursor = @root.ownerDocument.createElement('span')
  cursor.classList.add('cursor')
  cursor.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
  cursor.id = Scribe.Editor.CURSOR_PREFIX + userId
  inner = @root.ownerDocument.createElement('span')
  inner.classList.add('cursor-inner')
  inner.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
  nameNode = @root.ownerDocument.createElement('span')
  nameNode.classList.add('cursor-name')
  nameNode.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
  nameNode.textContent = name
  inner.style['background-color'] = nameNode.style['background-color'] = color
  cursor.appendChild(nameNode)
  cursor.appendChild(inner)
  return cursor

class ScribeMultiCursorManager
  constructor: (@editor) ->
    @cursors = {}
    @editor.renderer.addStyle({
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
      }
      '.cursor-inner': { 'display': 'inline-block', 'width': '2px', 'position': 'absolute', 'height': '15px', 'left': '-1px' }
      '.editor > .line:first-child .cursor-name': { 'border-top-left-radius': '0px', 'border-bottom-left-radius': '3px', 'top': '15px' }
    })
    @root = @editor.root

  shiftCursors: (index, length) ->
    _.each(@cursors, (cursor, id) =>
      return if cursor == undefined || cursor.index < index
      if (cursor.index > index)
        if length > 0
          this.setCursor(cursor.userId, cursor.index + length, cursor.name, cursor.color)   # Insert
        else
          # Delete needs to handle special case: start|cursor|end vs normal case: start|end|cursor
          this.setCursor(cursor.userId, cursor.index + Math.max(length, index - cursor.index), cursor.name, cursor.color)
    )

  setCursor: (userId, index, name, color) ->
    @cursors[userId] = {
      index: index
      name: name
      color: color
      userId: userId
    }
    cursor = @root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    unless cursor
      cursor = addCursor.call(this, userId, index, name, color)
    position = new Scribe.Position(this, index)
    parentNode = position.leafNode.parentNode
    [left, right] = Scribe.DOM.splitNode(position.leafNode, position.offset)
    parentNode.insertBefore(cursor, right)

  moveCursor: (userId, index) ->
    if @cursors[userId]
      this.setCursor(userId, index, @cursors[userId].name, @cursors[userId].color)

  clearCursors: ->
    _.each(@root.querySelectorAll('.cursor'), (cursor) ->
      cursor.parentNode.removeChild(cursor)
    )

  removeCursor: (userId) ->
    cursor = @root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    cursor.parentNode.removeChild(cursor) if cursor?


window.Scribe or= {}
window.Scribe.MultiCursorManager = ScribeMultiCursorManager
