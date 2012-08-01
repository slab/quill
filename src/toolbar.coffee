#= require editor

class Toolbar
  constructor: (@editor) ->

  bold: ->
    @editor.applyAttribute(@editor.getSelection(), { bold: true })

  italic: ->
    selection = @editor.getSelection()
    @editor.applyAttribute(@editor.getSelection(), { italic: true })

  strike: ->
    @editor.applyAttribute(@editor.getSelection(), { strike: true })

  underline: ->
    @editor.applyAttribute(@editor.getSelection(), { underline: true })


window.Tandem ||= {}
window.Tandem.Toolbar = Toolbar
