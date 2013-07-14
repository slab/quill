listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.USER_TEXT_CHANGE, (delta) ->
    console.info source.id, 'text change', delta
    target.applyDelta(delta)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", source, target, sourceDelta, targetDelta)
  ).on(Scribe.Editor.events.SELECTION_CHANGE, (range) ->
    console.info source.id, 'selection change', range.start.index, range.end.index
    target.cursorManager.setCursor(source.id, range.end.index, source.id, 'blue')
  )

editors = []
for num in [1, 2]
  wrapperClass = '.editor-wrapper'
  wrapperClass += if num == 1 then '.first' else '.last'
  editor = new Scribe.Editor(document.querySelector(wrapperClass + ' .editor-container'), {
    renderer: {
      styles: {
        'div.editor':
          top: '5px'
          left: '5px'
          right: '5px'
          bottom: '5px'
      }
    }
  })
  toolbar = new Scribe.Toolbar(document.querySelector(wrapperClass + ' .formatting-container'), editor)
  editor.cursorManager = new Scribe.MultiCursor(editor)
  editor.attributionManager = new Scribe.Attribution(editor, editor.id, 'blue') 
  editors.push(editor)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
editors[0].attributionManager.addAuthor(editors[1].id, 'blue')
editors[1].attributionManager.addAuthor(editors[0].id, 'blue')
