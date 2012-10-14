#= require eventemitter2

class TandemToolbar extends EventEmitter2
  constructor: (@editor) ->
    @editor.on(Tandem.Editor.events.USER_SELECTION_CHANGE, (selection) =>
      attributes = if selection then selection.getAttributes() else null
      console.log 'selection change', selection, attributes
      this.emit('update', attributes)
    ).on(Tandem.Editor.events.API_TEXT_CHANGE, (delta) ->
      console.log 'api text change', delta
    ).on(Tandem.Editor.events.USER_TEXT_CHANGE, (delta) ->
      console.log 'user text change', delta
    )

  applyAttribute: (name, value) ->
    selection = @editor.getSelection()
    if selection?
      startIndex = selection.start.getIndex()
      endIndex = selection.end.getIndex()
      if name != 'indent' && name != 'outdent'
        @editor.applyAttribute(startIndex, endIndex - startIndex, name, value)
      else
        increment = if name == 'outdent' then -1 else 1
        @editor.keyboard.indent(selection, increment)
      selection = @editor.getSelection()
      this.emit('update', selection.getAttributes())
      @editor.doc.root.focus()
      @editor.setSelection(new Tandem.Range(@editor, startIndex, endIndex))
    else
      console.warn "#{name} called with no selection"
      

window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
