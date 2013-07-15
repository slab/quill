CURSOR_COLOR = '#0054a6'

initToolbar = (container, editor, toolbar) ->
  $formattingContainer = $('.formatting-container', $(container))
  dropkickFormats = ['family', 'size']
  for format in dropkickFormats
    do (format) ->
      console.log format
      $(".#{format}", $formattingContainer).dropkick({
        change: (value) -> editor.selection.format(format, value)
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
    console.info source.id, 'selection change', range.start.index, range.end.index
    target.cursorManager.setCursor(source.id, range.end.index, source.id, CURSOR_COLOR)
  )


$(document).ready( ->
  editors = []
  for num in [1, 2]
    wrapperClass = '.editor-wrapper'
    wrapperClass += if num == 1 then '.first' else '.last'
    container = document.querySelector(wrapperClass)
    editor = new Scribe.Editor(container.querySelector('.editor-container'), {
      renderer:
        styles:
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
    toolbar = new Scribe.Toolbar(container.querySelector('.formatting-container'), editor)
    editor.cursorManager = new Scribe.MultiCursor(editor)
    editor.attributionManager = new Scribe.Attribution(editor, editor.id, CURSOR_COLOR)
    editors.push(editor)
    initToolbar(container, editor, toolbar)

  $('.dk_container').click( ->
    that = this
    $('.dk_container.dk_open').each( ->
      $(this).removeClass('dk_open') if that != this
    )
  )
  listenEditor(editors[0], editors[1])
  listenEditor(editors[1], editors[0])
  editors[0].attributionManager.addAuthor(editors[1].id, CURSOR_COLOR)
  editors[1].attributionManager.addAuthor(editors[0].id, CURSOR_COLOR)
)
