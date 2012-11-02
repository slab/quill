$(document).ready( ->
  window.editor = editor = new Tandem.Editor('editor-container')
  window.toolbar = toolbar = new Tandem.Toolbar(editor)
  
  toolbar.on 'update', (attributes) ->
    $.post('/ios-message/format-change', {json: JSON.stringify(attributes)})


  editor.getText = -> ""
  editor.setText = ->
  editor.setCursor = ->
  editor.clearCursors = ->
  editor.clearMessages = ->
  editor.addMessage = ->
  editor.updateComposing = ->


  delegate = new Object()
  jetClient = new JetClient({delegate: delegate})
  textState = new JetTextState(editor, jetClient, JetDelta.makeDelta(Stypi.configs.head), Stypi.configs.sessionId)
  chatState = new JetChatState(editor, jetClient, [], Stypi.configs.sessionId)
  cursorState = new JetCursorState(editor, jetClient, {}, Stypi.configs.sessionId)
  jetClient.addState(textState)
  jetClient.addState(cursorState)
  jetClient.addState(chatState)
  jetClient.connect(Stypi.configs.docId, Stypi.configs.version)

  textState.applyDeltaToText = (delta, authorId) ->   # Hacky overwrite
    editor.applyDelta(delta)
    data =
      docId: Stypi.configs.docId
    #$.post('/ios-message/text-init', {json: JSON.stringify(data)});

  textState.applyDeltaToCursors = ->
  Stypi.Presence = {
    setUsers: ->
  }

  editor.on(Tandem.Editor.events.API_TEXT_CHANGE, (delta) ->
    textState.localUpdate(delta)
    jetClient.checkRunwayReady()
  )
  editor.on(Tandem.Editor.events.USER_TEXT_CHANGE, (delta) ->
    textState.localUpdate(delta)
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

