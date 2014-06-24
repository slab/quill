basicEditor = new Quill('.basic-wrapper .editor-container',
  modules:
    authorship: { authorId: 'basic', color: 'white', enabled: false }
    toolbar: { container: '.basic-wrapper .toolbar-container' }
)

advancedEditor = new Quill('.advanced-wrapper .editor-container',
  modules:
    'authorship': { enabled: true }
    'toolbar': { container: '.advanced-wrapper .toolbar-container' }
    'link-tooltip': true
    'image-tooltip': true
    'multi-cursor': true
  theme: 'snow'
)

authorship = advancedEditor.getModule('authorship')
authorship.addAuthor('basic', 'rgba(255,153,51,0.4)')

cursorManager = advancedEditor.getModule('multi-cursor')
cursorManager.setCursor('basic', 0, 'basic', 'rgba(255,153,51,0.9)')

basicEditor.on('selection-change', (range) ->
  console.info 'basic', 'selection', range
  cursorManager.moveCursor('basic', range.end) if range?
)

basicEditor.on('text-change', (delta, source) ->
  console.info 'basic', 'text', delta, source
  return if source == 'api'
  advancedEditor.updateContents(delta)
  sourceDelta = basicEditor.getContents()
  targetDelta = advancedEditor.getContents()
  console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", sourceDelta, targetDelta)
)

advancedEditor.on('selection-change', (range) ->
  console.info 'advanced', 'selection', range
)

advancedEditor.on('text-change', (delta, source) ->
  console.info 'advanced', 'text', delta, source
  return if source == 'api'
  basicEditor.updateContents(delta)
  sourceDelta = advancedEditor.getContents()
  targetDelta = basicEditor.getContents()
  console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", sourceDelta, targetDelta)
)
