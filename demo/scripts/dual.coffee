#= require underscore
#= require jquery

listenEditor = (source, target) ->
  source.on(source.events.API_TEXT_CHANGE, (delta) ->
    for delta in delta.deltas
      for key,val of delta.attributes
        attr = {}
        attr[key] = val
        target.applyAttribute(delta.start, delta.end - delta.start, attr, false)
  )

editors = _.map([1, 2], (num) ->
  editor = new Tandem.Editor('editor-container' + num)
  toolbar = new Tandem.Toolbar(editor)
  $('#formatting-container' + num + ' .bold').click( -> toolbar.bold() )
  $('#formatting-container' + num + ' .italic').click( -> toolbar.italic() )
  $('#formatting-container' + num + ' .strike').click( -> toolbar.strike() )
  $('#formatting-container' + num + ' .underline').click( -> toolbar.underline() )
  return editor
)

listenEditor(editors[0], editors[1])
listenEditor(editors[1], editors[0])
