applyDelta = (delta) ->
  _.defer( =>
    delta.apply((index, text) =>
      this.shiftCursors(index, text.length)
    , (index, length) =>
      this.shiftCursors(index, -1 * length)
    )
  )


buildCursor = (userId, name, color) ->
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


class ScribeMultiCursorManager
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
      '.cursor-inner': { 'display': 'inline-block', 'width': '2px', 'position': 'absolute', 'height': '15px', 'left': '-1px' }
      '.editor > .line:first-child .cursor-name': { 'border-top-left-radius': '0px', 'border-bottom-left-radius': '3px', 'top': '15px' }
    })
    @editor.on(Scribe.Editor.events.API_TEXT_CHANGE, (delta) =>
      applyDelta.call(this, delta)
    )
    @editor.on(Scribe.Editor.events.TEXT_CHANGE, (delta) =>
      applyDelta.call(this, delta)
    )

  shiftCursors: (index, length) ->
    _.each(@cursors, (cursor, id) =>
      return if cursor == undefined || cursor.index < index
      if (cursor.index >= index)
        if length > 0
          this.setCursor(cursor.userId, cursor.index + length, cursor.name, cursor.color)   # Insert
        else
          # Delete needs to handle special case: start|cursor|end vs normal case: start|end|cursor
          this.setCursor(cursor.userId, cursor.index + Math.max(length, index - cursor.index), cursor.name, cursor.color)
    )

  setCursor: (userId, index, name, color) ->
    @editor.doSilently( =>
      @cursors[userId] = {
        index: index
        name: name
        color: color
        userId: userId
      }
      #consistent = Scribe.Debug.checkDocumentConsistency(@editor.doc)
      cursor = @container.querySelector("##{Scribe.Editor.CURSOR_PREFIX}#{userId}")
      unless cursor?
        cursor = buildCursor.call(this, userId, name, color)
        @container.appendChild(cursor)
      position = new Scribe.Position(@editor, index)
      if !position.leafNode.firstChild?
        cursor.style.top = position.leafNode.parentNode.offsetTop
        cursor.style.left = position.leafNode.parentNode.offsetLeft
      else
        [leftText, rightText, didSplit] = Scribe.DOM.splitNode(position.leafNode.firstChild, position.offset)
        if rightText?
          span = @container.ownerDocument.createElement('span')
          Scribe.DOM.wrap(span, rightText)
          cursor.style.top = span.offsetTop
          cursor.style.left = span.offsetLeft
          Scribe.DOM.unwrap(span)
        else if leftText?
          span = @container.ownerDocument.createElement('span')
          leftText.parentNode.parentNode.appendChild(span)
          cursor.style.top = span.offsetTop
          cursor.style.left = span.offsetLeft
          span.parentNode.removeChild(span)
        position.leafNode.normalize() if didSplit
    )

  moveCursor: (userId, index) ->
    if @cursors[userId]
      this.setCursor(userId, index, @cursors[userId].name, @cursors[userId].color)

  clearCursors: ->
    while @container.firstChild?
      @container.removeChild(@container.firstChild)
    @cursors = {}

  removeCursor: (userId) ->
    cursor = @editor.root.ownerDocument.getElementById(Scribe.Editor.CURSOR_PREFIX + userId)
    cursor.parentNode.removeChild(cursor) if cursor?


window.Scribe or= {}
window.Scribe.MultiCursorManager = ScribeMultiCursorManager
