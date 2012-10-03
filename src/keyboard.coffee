#= require tandem/editor

class TandemKeyboard
  @KEYS:
    tab: 9
    enter: 13

  constructor: (editor) ->
    @root = editor.doc.root
    @root.addEventListener('keydown', (event) ->
      event ||= window.event
      switch event.which
        when TandemKeyboard.KEYS.tab
          selection = editor.getSelection()
          intersection = selection.getAttributeIntersection(true)
          if intersection.bullet? || intersection.indent? || intersection.list?
            addition = if event.shiftKey == true then -1 else 1
            editor.applyAttribute(selection, 'bullet', addition) if intersection.bullet?
            editor.applyAttribute(selection, 'indent', addition) if intersection.indent?
            editor.applyAttribute(selection, 'list', addition) if intersection.list?
          else
            editor.deleteAt(selection)
            selection = editor.getSelection()
            editor.insertAt(selection, "\t")
        else
          return true

      event.preventDefault()
      return false
    )



window.Tandem ||= {}
window.Tandem.Keyboard = TandemKeyboard
