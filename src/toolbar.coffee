#= require editor

class TandemToolbar
  constructor: (@editor) ->

  bold: ->
    selection = @editor.getSelectionRange()
    if selection?
      @editor.applyAttribute(selection, { bold: true })
    else
      console.warn "Bold called with no selection"

  italic: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { italic: true })

  strike: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { strike: true })

  underline: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { underline: true })



window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
