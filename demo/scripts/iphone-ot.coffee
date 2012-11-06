$(document).ready( ->
  window.editor = editor = new Tandem.Editor('editor-container')
  window.toolbar = toolbar = new Tandem.Toolbar(editor, { keepHTML: false })
  
  toolbar.on 'update', (attributes) ->
    $.post('/ios-message/format-change', {json: JSON.stringify(attributes)})

  editor.setText = ->
  editor.clearMessages = ->
  editor.addMessage = ->
  editor.updateComposing = ->
  authors = {}
  editor.applyDelta = _.wrap(editor.applyDelta, (fn, delta) =>
    styles = {}
    _.each(delta.deltas, (delta) =>
      authorId = delta.attributes['author']
      if authorId? and !authors[authorId]?
        styles['.author-' + authorId] = {color: Stypi.Presence.getColorForUser(authorId)}
        authors[authorId] = true
    )
    if _.keys(styles).length > 0
      editor.renderer.addStyles(styles)
    fn.call(editor, delta)
  )

  delegate = new Object()
  jetClient = new JetClient({delegate: delegate})
  delta = JetDelta.makeDelta(Stypi.configs.head)
  delta.startLength = editor.doc.length
  textState = new JetTextState(editor, jetClient, delta, Stypi.configs.sessionId)
  cursorState = new JetCursorState(editor, jetClient, {}, Stypi.configs.sessionId)
  jetClient.addState(textState)
  jetClient.addState(cursorState)
  jetClient.connect(Stypi.configs.docId, Stypi.configs.version)
  
  onTextChange = (delta) =>
    if Stypi.configs.userId
      _.each(delta.deltas, (delta, index) ->
        delta.attributes['author'] = Stypi.configs.userId if delta.text?
      )
    textState.localUpdate(delta)
    jetClient.checkRunwayReady()

  editor.on(Tandem.Editor.events.API_TEXT_CHANGE, onTextChange)
  editor.on(Tandem.Editor.events.USER_TEXT_CHANGE, onTextChange)
  editor.on(Tandem.Editor.events.USER_SELECTION_CHANGE, (selection) =>
    index = selection.start.getIndex()
    cursor = {index: index}
    cursorState.localUpdate(cursor)
    jetClient.checkRunwayReady()
  )

  window.docText = ->
    _($('iframe').contents().find('body').find('.line'))
      .map( (line) -> 
        $(line).text()
      )
      .join(' ')
      .replace(/\s+/g,' ')
)

