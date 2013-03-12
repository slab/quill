class ScribeMultiCursorManager
  constructor: (@editor) ->
    @cursors = {}
    @editor.renderer.addStyle({
      '#cursor-container': {
        'font-family': "'Helvetica', 'Arial', san-serif"
        'font-size': '13px'
        'line-height': '15px'
      }
      '.cursor': { 'display': 'inline-block', 'height': '12px', 'position': 'absolute', 'width': '0px' }
      '.cursor-name': {
        'border-bottom-right-radius': '3px'
        'border-top-left-radius': '3px'
        'border-top-right-radius': '3px'
        'color': 'white'
        'display': 'inline-block'
        'left': '-1px'
        'padding': '2px 8px'
        'position': 'absolute'
        'top': '-18px' 
      }
      '.cursor-inner': { 'display': 'inline-block', 'width': '2px', 'position': 'absolute', 'height': '15px', 'left': '-1px' }
      '.editor > .line:first-child .cursor-name': { 'border-top-left-radius': '0px', 'border-bottom-left-radius': '3px', 'top': '15px' }
    })

  applyDeltaToCursors: (delta) ->
    this.jetSyncApplyDelta(delta, ((index, text) =>
      this.shiftCursors(index, text.length)
    ), ((start, end) =>
      this.shiftCursors(start, start-end)
    ))

  shiftCursors: (index, length) ->
    for id,cursor of @cursors
      if cursor == undefined || cursor.index < index
        continue
      if (cursor.index > index)
        if length > 0
          this.setCursor(cursor.userId, cursor.index + length, cursor.name, cursor.color)   # Insert
        else
          # Delete needs to handle special case: start|cursor|end vs normal case: start|end|cursor
          this.setCursor(cursor.userId, cursor.index + Math.max(length, index - cursor.index), cursor.name, cursor.color)

  setCursor: (userId, index, name, color) ->
    cursor = @doc.root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    unless cursor?
      cursor = @doc.root.ownerDocument.createElement('span')
      cursor.classList.add('cursor')
      cursor.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
      cursor.id = Scribe.Editor.CURSOR_PREFIX + userId
      inner = @doc.root.ownerDocument.createElement('span')
      inner.classList.add('cursor-inner')
      inner.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
      nameNode = @doc.root.ownerDocument.createElement('span')
      nameNode.classList.add('cursor-name')
      nameNode.classList.add(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
      nameNode.textContent = name
      inner.style['background-color'] = nameNode.style['background-color'] = color
      cursor.appendChild(nameNode)
      cursor.appendChild(inner)
      @cursorContainer.appendChild(cursor)
    @cursors[userId] = {
      index: index
      name: name
      color: color
      userId: userId
    }
    position = new Scribe.Position(this, index)
    [left, right, didSplit] = Scribe.DOM.splitNode(position.leafNode, position.offset)
    if right? && (right.offsetTop != 0 || right.offsetLeft != 0)
      cursor.style.top = right.parentNode
      cursor.style.top = right.offsetTop
      cursor.style.left = right.offsetLeft
      Scribe.DOM.mergeNodes(left, right) if didSplit
    else if left?
      span = left.ownerDocument.createElement('span')
      left.parentNode.appendChild(span)
      cursor.style.top = span.offsetTop
      cursor.style.left = span.offsetLeft
      span.parentNode.removeChild(span)
    else if right?
      cursor.style.top = right.parentNode.offsetTop
      cursor.style.left = right.parentNode.offsetLeft
    else
      console.warn "Could not set cursor"

  moveCursor: (userId, index) ->
    if @cursors[userId]
      this.setCursor(userId, index, @cursors[userId].name, @cursors[userId].color)

  clearCursors: ->
    _.each(@doc.root.querySelectorAll('.cursor'), (cursor) ->
      cursor.parentNode.removeChild(cursor)
    )

  removeCursor: (userId) ->
    cursor = @doc.root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    cursor.parentNode.removeChild(cursor) if cursor?


window.Scribe or= {}
window.Scribe.MultiCursorManager = ScribeMultiCursorManager
