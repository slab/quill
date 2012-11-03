$(document).ready( ->
  editor = new Tandem.Editor('editor-container')
  toolbar = new Tandem.Toolbar(editor)
  _.each(['bold', 'italic', 'strike', 'underline'], (format) ->
    $("#formatting-container .#{format}").click( -> 
      toolbar.applyAttribute(format, !$(this).hasClass('active'))
    )
  )
  toolbar.on('update', (attributes) ->
    $("#formatting-container .format-button").removeClass('active')
    for key,value of attributes when value == true
      $("#formatting-container .#{key}").addClass('active')
  )

  editor.getText = -> ""
  editor.setText = ->
  editor.setCursor = ->
  editor.clearCursors = ->
  editor.clearMessages = ->
  editor.addMessage = ->
  editor.updateComposing = ->


  delegate = new Object()
  jetClient = new JetClient({delegate: delegate})
  delta = JetDelta.makeDelta(Stypi.configs.head)
  delta.startLength = editor.doc.length
  textState = new JetTextState(editor, jetClient, delta, Stypi.configs.sessionId)
  chatState = new JetChatState(editor, jetClient, [], Stypi.configs.sessionId)
  jetClient.addState(textState)
  jetClient.addState(chatState)
  jetClient.connect(Stypi.configs.docId, Stypi.configs.version)

  textState.applyDeltaToText = (delta, authorId) ->   # Hacky overwrite
    editor.applyDelta(delta)
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
)
