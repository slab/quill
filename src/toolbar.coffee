#= require editor
#= require eventemitter2

class TandemToolbar extends EventEmitter2
  constructor: (@editor) ->
    @editor.on(@editor.events.USER_SELECTION_CHANGE, (selection) =>
      attributes = if selection then selection.getAttributeIntersection() else null
      console.log 'selection change', selection, attributes
      this.emit('update', attributes)
    ).on(@editor.events.API_TEXT_CHANGE, (delta) ->
      console.log 'api text change', delta
    ).on(@editor.events.USER_TEXT_CHANGE, (delta) ->
      console.log 'user text change', delta
    )

  applyAttribute: (name, value) ->
    selection = @editor.getSelection()
    if selection?
      if name != 'indent' && name != 'outdent'
        @editor.applyAttribute(selection, name, value)
      else
        increment = if name == 'outdent' then -1 else 1
        @editor.keyboard.indent(increment)
      this.emit('update', @editor.getSelection().getAttributeIntersection())
    else
      console.warn "#{name} called with no selection"
      

window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
