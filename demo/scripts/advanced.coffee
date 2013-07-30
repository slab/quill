getColor = (id, lighten) ->
  alpha = if lighten then '.4' else '1.0'
  if id == 'editor-1'
    return "rgba(0, 153, 255, #{alpha})"
  else
    return "rgba(255, 153, 51, #{alpha})"


initAttribution = (container, editor) ->
  button = container.querySelector('.attribution')
  attribution = new Scribe.Attribution(editor, editor.id, getColor(editor.id, true))
  Scribe.DOM.addEventListener(button, 'click', ->
    if Scribe.DOM.hasClass(button, 'active')
      attribution.disable()
    else
      attribution.enable()
    Scribe.DOM.toggleClass(button, 'active')
  )
  return attribution

initEditor = (container) ->
  editor = new Scribe.Editor(container.querySelector('.editor-container'), {
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

initToolbar = (container, editor) ->
  toolbar = new Scribe.Toolbar(container.querySelector('.formatting-container'), editor)
  $formattingContainer = $('.formatting-container', $(container))
  dropkickFormats = ['family', 'size']
  for format in dropkickFormats
    do (format) ->
      $(".#{format}", $formattingContainer).dropkick({
        change: (value) -> 
          range = editor.getSelection()
          range.formatContents(format, value, { source: 'user' }) if range?
        width: 75
      })
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, ->
    $(".family, .size", $formattingContainer).each((select) ->
      $(this).dropkick('set', $('option:selected', this).text())
    )
  )

listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.USER_TEXT_CHANGE, (delta) ->
    console.info source.id, 'text change', delta
    target.applyDelta(delta)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(sourceDelta.isEqual(targetDelta), "Editor diversion!", source, target, sourceDelta, targetDelta)
  ).on(Scribe.Editor.events.SELECTION_CHANGE, (range) ->
    if range?
      console.info source.id, 'selection change', range.start.index, range.end.index
      cursor = target.cursorManager.setCursor(source.id, range.end.index, source.id, getColor(source.id))
      cursor.elem.querySelector('.cursor-triangle').style.borderTopColor = getColor(source.id)
    else  
      console.info source.id, 'selection change', range
  )


$(document).ready( ->
  editors = []
  for num in [1, 2]
    wrapperClass = '.editor-wrapper'
    wrapperClass += if num == 1 then '.first' else '.last'
    container = document.querySelector(wrapperClass)
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
