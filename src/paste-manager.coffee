class TandemPasteManager
  constructor: (@editor) ->
    this.initListeners()

  initListeners: ->
    pasteDiv = @editor.doc.root.ownerDocument.createElement('div')
    pasteDiv.id = 'paste-container'
    pasteDiv.setAttribute('contenteditable', true)
    @editor.renderer.addStyles({
      '#paste-container': {
        'left': '-10000px'
        'position': 'fixed'
        'top': '50%'
      }  
    })
    @editor.doc.root.parentNode.appendChild(pasteDiv)
    @editor.doc.root.addEventListener('paste', =>
      @editor.selection.update()
      savedSelection = @editor.selection.save()
      pasteDiv.focus()
      _.defer( =>
        if savedSelection
          @editor.doc.root.focus()
          @editor.selection.restore(savedSelection)
          console.log pasteDiv
      )
    )



window.Tandem ||= {}
window.Tandem.PasteManager = TandemPasteManager
