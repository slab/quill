#= require underscore
#= require jquery

listenEditor = (source, target) ->
  source.on(Scribe.Editor.events.TEXT_CHANGE, (delta) ->
    target.applyDelta(delta, false)
    sourceDelta = source.doc.toDelta()
    targetDelta = target.doc.toDelta()
    console.assert(_.isEqual(sourceDelta, targetDelta), "Editor diversion!", source, target)
  )

editors = _.map([1, 2], (num) ->
  editor = new Scribe.Editor('editor-container' + num)
  _.each(['bold', 'italic', 'strike', 'underline', 'bullet', 'list', 'indent', 'outdent'], (format) ->
    $("#formatting-container#{num} .#{format}").click( -> 
      editor.selection.applyAttribute(format, !$(this).hasClass('active'))
    )
  )
  _.each(['family', 'size'], (format) ->
    $("#formatting-container#{num} .#{format}").change( ->
      editor.selection.applyAttribute(format, $(this).val())
    )
  )
  $("#formatting-container#{num} .link").click( ->
    if ($(this).hasClass('active'))
      editor.selection.applyAttribute('link', false)
    else
      editor.selection.applyAttribute('link', 'http://www.google.com')
  )
  editor.on(Scribe.Editor.events.SELECTION_CHANGE, (selection) ->
    attributes = selection.getAttributes()
    $("#formatting-container#{num} .format-button").removeClass('active')
    for key,value of attributes when value
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
