#= require underscore
#= require jquery

listenEditor = (source, target) ->
  source.on(source.events.API_TEXT_CHANGE, (delta) ->
    target.applyDelta(delta)
  )
  source.on(source.events.USER_TEXT_CHANGE, (delta) ->
    target.applyDelta(delta)
  )

editors = _.map([1, 2], (num) ->
  editor = new Tandem.Editor('editor-container' + num)
  toolbar = new Tandem.Toolbar(editor)
  _.each(['bold', 'italic', 'strike', 'underline'], (format) ->
    $("#formatting-container#{num} .#{format}").click( -> 
      toolbar.applyAttribute(format, !$(this).parent().hasClass('active'))
    )
  )
  toolbar.on('update', (attributes) ->
    $("#formatting-container#{num} .format-button").removeClass('active')
    for key,value of attributes when value == true
      $("#formatting-container#{num} .#{key}").parent().addClass('active')
  )
  return editor
)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
