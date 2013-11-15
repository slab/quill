editor = new Scribe.Editor('editor-container',
  modules:
    toolbar: { container: 'formatting-container' }
)

editor.on(Scribe.Editor.events.POST_EVENT, (args...) =>
  console.info(args...)
)
