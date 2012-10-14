#= require underscore
#= require jquery

listenEditor = (source, target) ->
  source.on(Tandem.Editor.events.API_TEXT_CHANGE, (delta) ->
    target.applyDelta(delta)
    sourceHtml = Tandem.Utils.cleanHtml(source.doc.root.innerHTML)
    targetHtml = Tandem.Utils.cleanHtml(target.doc.root.innerHTML)
    console.assert(sourceHtml == targetHtml, "Editor diversion!", source, target)
  )
  source.on(Tandem.Editor.events.USER_TEXT_CHANGE, (delta) ->
    target.applyDelta(delta)
    sourceHtml = Tandem.Utils.cleanHtml(source.doc.root.innerHTML)
    targetHtml = Tandem.Utils.cleanHtml(target.doc.root.innerHTML)
    console.assert(sourceHtml == targetHtml, "Editor diversion!", source, target)
  )

editors = _.map([1, 2], (num) ->
  editor = new Tandem.Editor('editor-container' + num)
  toolbar = new Tandem.Toolbar(editor)
  _.each(['bold', 'italic', 'strike', 'underline', 'bullet', 'list', 'indent', 'outdent'], (format) ->
    $("#formatting-container#{num} .#{format}").click( -> 
      toolbar.applyAttribute(format, !$(this).hasClass('active'))
    )
  )
  _.each(['font-family', 'font-size'], (format) ->
    $("#formatting-container#{num} .#{format}").change( ->
      toolbar.applyAttribute(format, $(this).val())
    )
  )
  $("#formatting-container#{num} .link").click( ->
    if ($(this).hasClass('active'))
      toolbar.applyAttribute('link', false)
    else
      toolbar.applyAttribute('link', 'http://www.google.com')
  )
  toolbar.on('update', (attributes) ->
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
