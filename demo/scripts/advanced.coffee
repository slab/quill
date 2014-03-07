# IE feature detection
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

listenEditor = (source, target) ->
  source.on(Scribe.events.TEXT_CHANGE, (delta, origin) ->
    return if origin == 'api'
    target.updateContents(delta)
    sourceDelta = source.getContents()
    targetDelta = target.getContents()
    decomposeDelta = targetDelta.decompose(sourceDelta)
    isEqual = _.all(decomposeDelta.ops, (op) ->
      return false if op.delta?
      return true if (_.keys(op.attributes).length == 0)
      sourceOp = sourceDelta.getOpsAt(op.start, op.end - op.start)
      return true if sourceOp.length == 1 and sourceOp[0].delta == "\n"
      return false
    )
    console.assert(decomposeDelta.startLength == decomposeDelta.endLength and isEqual, "Editor diversion!", source, target, sourceDelta, targetDelta) if console?
  ).on(Scribe.events.SELECTION_CHANGE, (range) ->
    return unless range?
    color = getColor(source.editor.id)
    cursor = target.modules['multi-cursor'].setCursor(source.editor.id, range.end.index, source.editor.id, color)
    $('.cursor-triangle', cursor.elem).css('border-top-color', color)
  )


editors = []
for num in [1, 2]
  $wrapper = $(".editor-wrapper.#{if num == 1 then 'first' else 'last'}")
  $container = $('.editor-container', $wrapper)
  editor = new Scribe($container.get(0), {
    logLevel: 'info'
    modules:
      'attribution': {
        enabled: false
        color: getColor(num, true)
        button: $('.sc-attribution', $wrapper).get(0)
      }
      'multi-cursor': {}    # TODO does passing in null or true work?
      'toolbar': {
        container: $('.toolbar-container', $wrapper).get(0)
      }
    theme: 'snow'
  })
  editors.push(editor)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
editors[0].modules.attribution.addAuthor(editors[1].editor.id, getColor(editors[1].editor.id, true))
editors[1].modules.attribution.addAuthor(editors[0].editor.id, getColor(editors[0].editor.id, true))
