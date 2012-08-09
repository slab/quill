#= require editor

class TandemToolbar
  constructor: (@editor) ->
    @editor.on(@editor.events.USER_SELECTION_CHANGE, (selection) ->
      console.log 'selection change', selection
    ).on(@editor.events.API_TEXT_CHANGE, (delta) ->
      console.log 'api text change', delta
    )

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
