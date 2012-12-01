#= require underscore
#= require jquery

listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.TEXT_CHANGE, (delta) ->
    target.applyDelta(delta)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", source, target)
  )

editors = _.map([1, 2], (num) ->
  editor = new Scribe.Editor('editor-container' + num)
  _.each(['bold', 'italic', 'strike', 'underline', 'bullet', 'list', 'indent', 'outdent'], (format) ->
    $("#formatting-container#{num} .#{format}").click( -> 
      editor.selection.format(format, !$(this).hasClass('active'))
    )
  )
  _.each(['family', 'size'], (format) ->
    $("#formatting-container#{num} .#{format}").change( ->
      editor.selection.format(format, $(this).val())
    )
  )
  $("#formatting-container#{num} .link").click( ->
    if ($(this).hasClass('active'))
      editor.selection.format('link', false)
    else
      editor.selection.format('link', 'http://www.google.com')
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    formats = selection.getFormats()
    $("#formatting-container#{num} .format-button").removeClass('active')
    for key,value of formats when value
      container = $("#formatting-container#{num} .#{key}") 
      if container.is('button')
        container.addClass('active')
      else
        container.val(value)
  )
  return editor
)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
