_ = Quill.require('lodash')

quillBasic = new Quill('.basic-wrapper .editor-container',
  modules:
    authorship: { authorId: 'basic' }
    toolbar: { container: '.basic-wrapper .toolbar-container' }
  styles: false
)

quillAdvanced = new Quill('.advanced-wrapper .editor-container',
  modules:
    'authorship': { authorId: 'advanced', enabled: true }
    'toolbar': { container: '.advanced-wrapper .toolbar-container' }
    'link-tooltip': true
    'image-tooltip': true
    'multi-cursor': true
  styles: false
  theme: 'snow'
)

authorship = quillAdvanced.getModule('authorship')
authorship.addAuthor('basic', 'rgba(255,153,51,0.4)')

cursorManager = quillAdvanced.getModule('multi-cursor')
cursorManager.setCursor('basic', 0, 'basic', 'rgba(255,153,51,0.9)')

quillBasic.on('selection-change', (range) ->
  console.info 'basic', 'selection', range
  cursorManager.moveCursor('basic', range.end) if range?
)

quillBasic.on('text-change', (delta, source) ->
  return if source == 'api'
  console.info 'basic', 'text', delta, source
  quillAdvanced.updateContents(delta)
  sourceDelta = quillBasic.getContents()
  targetDelta = quillAdvanced.getContents()
  console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", sourceDelta.ops, targetDelta.ops)
)

quillAdvanced.on('selection-change', (range) ->
  console.info 'advanced', 'selection', range
)

quillAdvanced.on('text-change', (delta, source) ->
  return if source == 'api'
  console.info 'advanced', 'text', delta, source
  quillBasic.updateContents(delta)
  sourceDelta = quillAdvanced.getContents()
  targetDelta = quillBasic.getContents()
  console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", sourceDelta.ops, targetDelta.ops)
)
