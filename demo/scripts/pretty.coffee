initToolbar = (editor) ->
  toolbar = new Scribe.Toolbar('formatting-container', editor)
  dropkickFormats = ['family', 'size']
  $('.dk_container').click( ->
    that = this
    $('.dk_container.dk_open').each( ->
      $(this).removeClass('dk_open') if that != this
    )
  )
  _.each(dropkickFormats, (format) ->
    $(".formatting-container .#{format}").dropkick({
      change: (value) -> editor.selection.format(format, value)
      width: 75
    })
  )
  toolbar.on(Scribe.Toolbar.events.FORMAT, (format, value) ->
    if _.indexOf(dropkickFormats, format) > -1
      $("#formatting-container .#{format}").dropkick('set', ' ')
    else if format == 'link'
      selection = editor.getSelection()
      node = selection.start.leafNode or selection.end.leafNode
      $(node).click() if node?
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, ->
    $(".formatting-container .family, .formatting-container .size").each((select) ->
      $(this).dropkick('set', $('option:selected', this).text())
    )
  )


$(document).ready( ->
  editor = new Scribe.Editor("editor-container", {
    renderer:
      styles:
        'a': { 'color': '#06c' }
        '#link-tooltip':
          'border': '1px solid #ccc'
          'box-shadow': '0px 0px 5px #ddd'
          'color': '#222'
        '#link-tooltip a':
          'color': '#06c'
  })

  initToolbar(editor)
)