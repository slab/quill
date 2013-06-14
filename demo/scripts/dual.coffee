listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.TEXT_CHANGE, (delta) ->
    console.info source.id, 'text change', delta
    target.applyDelta(delta)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", source, target, sourceDelta, targetDelta)
  ).on(Scribe.Editor.events.SELECTION_CHANGE, (range) ->
    console.info source.id, 'selection change', range.start.index, range.end.index
    target.cursorManager.setCursor(source.id, range.end.index, source.id, 'blue')
  )

editors = _.map([1, 2], (num) ->
  editor = new Scribe.Editor('editor-container' + num)
  toolbar = new Scribe.Toolbar("formatting-container#{num}", editor)
  editor.cursorManager = new Scribe.MultiCursor(editor)
  editor.attributionManager = new Scribe.Attribution(editor, editor.id, 'blue') 
  return editor
)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
editors[0].attributionManager.addAuthor(editors[1].id, 'blue')
editors[1].attributionManager.addAuthor(editors[0].id, 'blue')
