#= require editor
#= require eventemitter2

class TandemToolbar extends EventEmitter2
  constructor: (@editor) ->
    @editor.on(@editor.events.USER_SELECTION_CHANGE, (selection) =>
      console.log 'selection change', selection
      this.emit('update', selection.getAttributeIntersection())
    ).on(@editor.events.API_TEXT_CHANGE, (delta) ->
      console.log 'api text change', delta
    )

  applyAttribute: (name, value) ->
    selection = @editor.getSelectionRange()
    if selection?
      attribute = {}
      attribute[name] = value
      @editor.applyAttribute(selection, attribute)
      this.emit('update', selection.getAttributeIntersection())
    else
      console.warn "#{name} called with no selection"

  bold: ->
    this.applyAttribute('bold', true)

  italic: ->
    this.applyAttribute('italic', true)

  strike: ->
    this.applyAttribute('strike', true)

  underline: ->
    this.applyAttribute('underline', true)



window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
