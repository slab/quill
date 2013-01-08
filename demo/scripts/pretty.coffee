$(document).ready( ->
  editor = new Scribe.Editor("editor-container", {
    styles: {
      'a': { 'color': '#06c' }
      '.editor': { 'min-height': '95%' }
    }
  })

  _.each(['family', 'size'], (format) ->
    $(".formatting-container .#{format}").dropkick({
      change: (value) ->
        editor.selection.format(format, $(this).val())
      width: 75
    })
  )
  $('.dk_container').click( ->
    that = this
    $('.dk_container.dk_open').each( ->
      $(this).removeClass('dk_open') if that != this
    )
  )
  _.each(['bold', 'italic', 'strike', 'underline', 'list', 'bullet', 'outdent', 'indent'], (format) ->
    $(".formatting-container .#{format}").click( ->
      editor.selection.format(format, !$(this).parent().hasClass('active'))
    )
  )
  $(".formatting-container .link").click( ->
    selection = editor.getSelection()
    link = if $(this).parent().hasClass('active') then false else selection.getText()
    editor.selection.format('link', link)
    selection = editor.getSelection()
    $link = $('a', selection.start.leafNode).first() or $('a', selection.end.leafNode).first()
    unless _.any([selection.start.leafNode, selection.end.leafNode], (node) ->
      if node.tagName == 'A'
        showLinkEditor(editor, node)
        return true
      return false
    )
      $link = $('a', selection.start.leafNode).first() or $('a', selection.end.leafNode).first()
      showLinkEditor(editor, $link.get(0)) if $link
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    formats = selection.getFormats()
    $(".formatting-container .format-button").removeClass('active')
    $(".formatting-container .format-dropdown .default").each(->
      $(this).parent().val($(this).val()).change()
    )
    for key,value of formats
      container = $(".formatting-container .#{key}")
      if container.is('select')
        if !_.isArray(value)
          container.val(value).change()
        else
          $(".formatting-container .#{key}").dropkick('set', ' ')
      else
        container.parent().addClass('active')
  )
)