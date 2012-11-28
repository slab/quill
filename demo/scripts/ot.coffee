$(document).ready( ->
  editor = new Scribe.Editor('editor-container')
  _.each(['bold', 'italic', 'strike', 'underline'], (format) ->
    $("#formatting-container .#{format}").click( -> 
      editor.selection.applyAttribute(format, !$(this).hasClass('active'))
    )
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    attributes = selection.getAttributes()
    $("#formatting-container .format-button").removeClass('active')
    for key,value of attributes when value == true
      $("#formatting-container .#{key}").addClass('active')
  )

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
  jetClient.addState(textState)
  jetClient.connect(Stypi.configs.docId, Stypi.configs.version)

  editor.on(Scribe.Editor.events.TEXT_CHANGE, (delta) =>
    if Stypi.configs.userId
      _.each(delta.deltas, (delta, index) ->
        delta.attributes['author'] = Stypi.configs.userId if delta.text?
      )
    textState.localUpdate(delta)
    jetClient.checkRunwayReady()
  )
)
