#= require editor
#= require eventemitter2

class TandemToolbar extends EventEmitter2
  constructor: (@editor) ->
    @editor.on(@editor.events.USER_SELECTION_CHANGE, (selection) =>
      attributes = selection.getAttributeIntersection()
      console.log 'selection change', selection, attributes
      this.emit('update', attributes)
    ).on(@editor.events.API_TEXT_CHANGE, (delta) ->
      console.log 'api text change', delta
    )

  applyAttribute: (name, value) ->
    selection = @editor.getSelection()
    if selection?
      attribute = {}
      attribute[name] = value
      @editor.applyAttribute(selection, attribute)
      this.emit('update', @editor.getSelection().getAttributeIntersection())
    else
      console.warn "#{name} called with no selection"

  bold: (value = true) ->
    this.applyAttribute('bold', value)

  italic: (value = true) ->
    this.applyAttribute('italic', value)

  strike: (value = true) ->
    this.applyAttribute('strike', value)

  underline: (value = true) ->
    this.applyAttribute('underline', value)



window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
