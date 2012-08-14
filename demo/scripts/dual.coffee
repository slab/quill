#= require underscore
#= require jquery

applyDelta = (newDelta, insertFn, deleteFn, retainFn, context = null) ->
  index = 0       # Stores where the last retain end was, so if we see another one, we know to delete
  offset = 0      # Tracks how many characters inserted to correctly offset new text
  for delta in newDelta.deltas
    authorId = if delta.attributes? then delta.attributes.authorId else 1
    if JetDelta.isInsert(delta)
      insertFn.call(context || insertFn, index + offset, delta.text, authorId)
      offset += delta.length
    else if JetDelta.isRetain(delta)
      console.assert(delta.start >= index, "Somehow delta.start became smaller than index")
      if delta.start > index
        deleteFn.call(context || deleteFn, index + offset, delta.start + offset, authorId)
        offset -= (delta.start - index)
      index = delta.end
    else
      console.assert(false, "Unrecognized type in delta", delta)

  # If end of text was deleted
  if newDelta.endLength < newDelta.startLength + offset
    deleteFn.call(context || deleteFn, newDelta.endLength, newDelta.startLength + offset)
  return

listenEditor = (source, target) ->
  source.on(source.events.API_TEXT_CHANGE, (delta) ->
    for delta in delta.deltas
      for key,val of delta.attributes
        attr = {}
        attr[key] = val
        target.applyAttribute(delta.start, delta.end - delta.start, attr, false)
  )
  source.on(source.events.USER_TEXT_CHANGE, (delta) ->
    console.log 'text change', delta
    applyDelta(delta, (index, text) ->
      target.insertAt(index, text)
    , (start, end) ->
      target.deleteAt(start, end - start)
    )
  )

editors = _.map([1, 2], (num) ->
  editor = new Tandem.Editor('editor-container' + num)
  toolbar = new Tandem.Toolbar(editor)
  _.each(['bold', 'italic', 'strike', 'underline'], (format) ->
    $("#formatting-container#{num} .#{format}").click( -> 
      toolbar[format].call(toolbar, !$(this).parent().hasClass('active'))
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
