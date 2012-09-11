$(document).ready( ->
  editor = new Tandem.Editor('editor-container')
  toolbar = new Tandem.Toolbar(editor)
  _.each(['bold', 'italic', 'strike', 'underline'], (format) ->
    $("#formatting-container .#{format}").click( -> 
      toolbar.applyAttribute(format, !$(this).parent().hasClass('active'))
    )
  )
  toolbar.on('update', (attributes) ->
    $("#formatting-container .format-button").removeClass('active')
    for key,value of attributes when value == true
      $("#formatting-container .#{key}").parent().addClass('active')
  )

  rangy.init()

  editor.setText = (text) ->

  delegate = new Object()
  jetClient = new JetClient({delegate: delegate})
  textState = new JetTextState(editor, jetClient, "Welcome to Stypi", Stypi.configs.sessionId)
  jetClient.addState(textState)
  jetClient.connect(Stypi.configs.docId, Stypi.configs.version)

  textState.applyDeltaToText = (delta, authorId) ->   # Hacky overwrite
    editor.applyDelta(delta)
  textState.applyDeltaToCursors = ->
  Stypi.Presence = {
    setUsers: ->
  }

  editor.on(editor.events.API_TEXT_CHANGE, (delta) ->
    console.log 'send to remote'
    # Send to remote
  )
  editor.on(editor.events.USER_TEXT_CHANGE, (delta) ->
    textState.localUpdate(delta)
    jetClient.checkRunwayReady()
  )
)
