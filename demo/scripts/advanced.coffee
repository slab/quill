supportsRGBA = true
scriptElem = document.getElementsByTagName('script')[0]
try
  scriptElem.style.color = 'rgba(128,128,128,0.5)'
catch e
  supportsRGBA = false
finally
  scriptElem.style.color = ""


getColor = (id, lighten) ->
  alpha = if lighten then '0.4' else '1.0'
  if id == 'editor-1'
    return if supportsRGBA then "rgba(0,153,255,#{alpha})" else "rgb(0,153,255)"
  else
    return if supportsRGBA then "rgba(255,153,51,#{alpha})" else "rgb(255,153,51)"

initAttribution = (container, editor) ->
  attribution = new Scribe.Attribution(editor, editor.id, getColor(editor.id, true))
  $('.attribution', container).click( ->
    if $(this).hasClass('active')
      attribution.disable()
    else
      attribution.enable()
    $(this).toggleClass('active')
  )
  return attribution

initToolbar = (container, editor) ->
  formattingContainer = container.querySelector('.formatting-container')
  toolbar = new Scribe.Toolbar(formattingContainer, editor)
  for format in ['font-name', 'font-size', 'fore-color', 'back-color']
    Scribe.Picker.init(formattingContainer.querySelector(".#{format}"))

listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.USER_TEXT_CHANGE, (delta) ->
    console.info source.id, 'text change', delta if console?
    target.applyDelta(delta)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", source, target, sourceDelta, targetDelta) if console?
  ).on(Scribe.Editor.events.SELECTION_CHANGE, (range) ->
    if range?
      console.info source.id, 'selection change', range.start.index, range.start.leafNode, range.end.index, range.end.leafNode if console?
      color = getColor(source.id)
      console.log target.modules
      cursor = target.modules['multi-cursor'].setCursor(source.id, range.end.index, source.id, color)
      cursor.elem.querySelector('.cursor-triangle').style.borderTopColor = color
    else  
      console.info source.id, 'selection change', range if console?
  ).on(Scribe.Editor.events.FOCUS_CHANGE, (hasFocus) ->
    console.info source.id, 'focus change', hasFocus if console?
  )


editors = []
for num in [1, 2]
  wrapper = document.querySelector(".editor-wrapper.#{if num == 1 then 'first' else 'last'}")
  container = wrapper.querySelector('.editor-container')
  editor = new Scribe.Editor(container, {
    modules:
      #'attribution': {}
      'multi-cursor': {}
      'toolbar': {
        container: wrapper.querySelector('.toolbar-container')
      }
    theme: 'snow'
  })
  #editor.attributionManager = initAttribution(container, editor)
  editors.push(editor)
listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
#editors[0].attributionManager.addAuthor(editors[1].id, getColor(editors[1].id, true))
#editors[1].attributionManager.addAuthor(editors[0].id, getColor(editors[0].id, true))
