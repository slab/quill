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
  if id == 1 or id == 'editor-1'
    return if supportsRGBA then "rgba(0,153,255,#{alpha})" else "rgb(0,153,255)"
  else
    return if supportsRGBA then "rgba(255,153,51,#{alpha})" else "rgb(255,153,51)"

initAttribution = (wrapper, editor) ->
  Scribe.DOM.addEventListener(wrapper.querySelector('.attribution'), 'click', ->
    if Scribe.DOM.hasClass(container, 'active')
      editor.modules.attribution.disable()
    else
      editor.modules.attribution.enable()
    Scribe.DOM.toggleClass(container, 'active')
  )

initToolbar = (container, editor) ->
  formattingContainer = container.querySelector('.formatting-container')
  toolbar = new Scribe.Toolbar(formattingContainer, editor)
  for format in ['font-name', 'font-size', 'fore-color', 'back-color']
    Scribe.Picker.init(formattingContainer.querySelector(".#{format}"))

listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.POST_EVENT, (name, value, args...) ->
    console.info(name, value, args...) if console?
    switch name
      when Scribe.Editor.events.USER_TEXT_CHANGE
        target.applyDelta(value)
        sourceDelta = source.getDelta()
        targetDelta = target.getDelta()
        decomposeDelta = targetDelta.decompose(sourceDelta)
        isEqual = Scribe._.all(decomposeDelta.ops, (op) ->
          return false if op.value?
          return true if (Scribe._.keys(op.attributes).length == 0)
          sourceOp = sourceDelta.getOpsAt(op.start, op.end - op.start)
          return true if sourceOp.length == 1 and sourceOp[0].value == "\n"
          return false
        )
        console.assert(decomposeDelta.startLength == decomposeDelta.endLength and isEqual, "Editor diversion!", source, target, sourceDelta, targetDelta) if console?
      when Scribe.Editor.events.SELECTION_CHANGE
        if value?
          color = getColor(source.id)
          cursor = target.modules['multi-cursor'].setCursor(source.id, value.end.index, source.id, color)
          cursor.elem.querySelector('.cursor-triangle').style.borderTopColor = color
  )


editors = []
for num in [1, 2]
  wrapper = document.querySelector(".editor-wrapper.#{if num == 1 then 'first' else 'last'}")
  container = wrapper.querySelector('.editor-container')
  editor = new Scribe.Editor(container, {
    modules:
      'attribution': {
        enabled: false
        color: getColor(num, true)
      }
      'multi-cursor': {}
      'toolbar': {
        container: wrapper.querySelector('.toolbar-container')
      }
    theme: Scribe.Themes.Snow
  })
  initAttribution(wrapper, editor)
  editors.push(editor)
listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
editors[0].modules.attribution.addAuthor(editors[1].id, getColor(editors[1].id, true))
editors[1].modules.attribution.addAuthor(editors[0].id, getColor(editors[0].id, true))
