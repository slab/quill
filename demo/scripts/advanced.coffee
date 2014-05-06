getColor = (id, lighten) ->
  alpha = if lighten then '0.4' else '1.0'
  return if id == 1 or id == 'quill-1' then "rgba(0,153,255,#{alpha})" else "rgba(255,153,51,#{alpha})"

listenEditor = (source, target) ->
  source.on(Quill.events.TEXT_CHANGE, (delta, origin) ->
    console.log source.id, 'text', delta, origin
    return if origin == 'api'
    target.updateContents(delta)
    sourceDelta = source.getContents()
    targetDelta = target.getContents()
    console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", source, target, sourceDelta, targetDelta)
  ).on(Quill.events.SELECTION_CHANGE, (range) ->
    console.log source.id, 'selection', range
    return unless range?
    cursorManager = target.getModule('multi-cursor')
    cursorManager.moveCursor(source.id, range.end)
  )


editors = []
for num in [1, 2]
  $wrapper = $(".editor-wrapper.#{if num == 1 then 'first' else 'last'}")
  $container = $('.editor-container', $wrapper)
  editor = new Quill($container.get(0), {
    modules:
      'toolbar': { container: $('.toolbar-container', $wrapper).get(0) }
      'link-tooltip': true
      'image-tooltip': true
      'multi-cursor': true
    theme: 'snow'
  })
  authorship = editor.addModule('authorship', {
    authorId: editor.id
    color: getColor(num, true)
  })
  editors.push(editor)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
editors[0].getModule('authorship').addAuthor(editors[1].id, getColor(editors[1].id, true))
editors[1].getModule('authorship').addAuthor(editors[0].id, getColor(editors[0].id, true))
setTimeout( ->
  editors[0].getModule('multi-cursor').setCursor(editors[1].id, 0, editors[1].id, getColor(editors[1].id))
  editors[1].getModule('multi-cursor').setCursor(editors[0].id, 0, editors[0].id, getColor(editors[0].id))
, 1)
