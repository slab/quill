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

initAttribution = ($container, editor) ->
  attribution = new Scribe.Attribution(editor, editor.id, getColor(editor.id, true))
  $('.attribution', $container).click( ->
    if $(this).hasClass('active')
      attribution.disable()
    else
      attribution.enable()
    $(this).toggleClass('active')
  )
  return attribution

initEditor = ($container) ->
  editor = new Scribe.Editor($('.editor-container', $container).get(0), {
    renderer:
      styles:
        'div.editor': { 'bottom': '15px', 'top': '15px' }
        'a': { 'color': '#06c' }
        '#link-tooltip':
          'border': '1px solid #ccc'
          'box-shadow': '0px 0px 5px #ddd'
          'color': '#222'
        '#link-tooltip a':
          'color': '#06c'
        '#link-tooltip .input':
          'border': '1px solid #ccc'
          'margin': '0px'
          'padding': '3px'
  })
  editor.cursorManager = new Scribe.MultiCursor(editor, {
    template:
     '<span class="cursor-flag">
        <span class="cursor-name"></span>
        <span class="cursor-triangle"></span>
      </span>
      <span class="cursor-caret"></span>'
  });
  editor.renderer.addStyles(
    '.cursor-name':
      'border-radius': '3px'
      'font-size': '11px'
      'font-family': 'Arial'
      'margin-left': '-50%'
      'padding': '4px 10px'
    '.cursor-triangle':
      'border-left': '4px solid transparent'
      'border-right': '4px solid transparent'
      'border-top': '4px solid transparent'
      'display': 'block'
      'height': '0px'
      'margin-bottom': '-1px'
      'margin-left': '-3px'
      'width': '0px'
    '.cursor.top > .cursor-flag': { 'bottom': '100%', 'top': 'auto' }
  )
  return editor

initToolbar = ($container, editor) ->
  $formattingContainer = $('.formatting-container', $container)
  toolbar = new Scribe.Toolbar($formattingContainer.get(0), editor)
  for format in ['font-name', 'font-size']
    do (format) ->
      $(".#{format}", $formattingContainer).dropkick({
        change: (value) -> 
          range = editor.getSelection()
          range.format(format, value, { source: 'user' }) if range?
        width: 75
      })
  for format in ['fore-color', 'back-color']
    Scribe.ColorPicker.init($(".#{format}", $formattingContainer).get(0))
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, ->
    $(".font-name, .font-size", $formattingContainer).each((select) ->
      $(this).dropkick('set', $('option:selected', this).text())
    )
  )


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
      cursor = target.cursorManager.setCursor(source.id, range.end.index, source.id, color)
      cursor.elem.querySelector('.cursor-triangle').style.borderTopColor = color
    else  
      console.info source.id, 'selection change', range if console?
  ).on(Scribe.Editor.events.FOCUS_CHANGE, (hasFocus) ->
    console.info source.id, 'focus change', hasFocus if console?
  )


$(document).ready( ->
  editors = []
  for num in [1, 2]
    wrapperClass = '.editor-wrapper'
    wrapperClass += if num == 1 then '.first' else '.last'
    container = $(wrapperClass)
    editor = initEditor(container)
    editor.attributionManager = initAttribution(container, editor)
    editor.toolbar = initToolbar(container, editor)
    editors.push(editor)
  $('.dk_container').click( ->
    that = this
    $('.dk_container.dk_open').each( ->
      $(this).removeClass('dk_open') if that != this
    )
  )
  listenEditor(editors[0], editors[1])
  listenEditor(editors[1], editors[0])
  editors[0].attributionManager.addAuthor(editors[1].id, getColor(editors[1].id, true))
  editors[1].attributionManager.addAuthor(editors[0].id, getColor(editors[0].id, true))
)
