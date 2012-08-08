#= require editor

class TandemToolbar
  constructor: (@editor) ->

  bold: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { bold: true })

  italic: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { italic: true })

  strike: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { strike: true })

  underline: ->
    @editor.applyAttribute(@editor.getSelectionRange(), { underline: true })


window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
