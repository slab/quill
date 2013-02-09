listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.TEXT_CHANGE, (delta) ->
    console.info 'text change', delta
    target.applyDelta(delta)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", source, target)
  )

editors = _.map([1, 2], (num) ->
  editor = new Scribe.Editor('editor-container' + num)
  toolbar = new Scribe.Toolbar("formatting-container#{num}", editor)
  return editor
)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
