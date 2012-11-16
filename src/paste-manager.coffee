class TandemPasteManager
  constructor: (@editor) ->
    @container = @editor.doc.root.ownerDocument.createElement('div')
    @container.id = 'paste-container'
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles({
      '#paste-container': {
        'left': '-10000px'
        'position': 'fixed'
        'top': '50%'
      }  
    })
    @editor.doc.root.parentNode.appendChild(@container)
    this.initListeners()

  initListeners: ->
    @editor.doc.root.addEventListener('paste', =>
      @editor.selection.update()
      savedSelection = @editor.selection.save()
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        if savedSelection
          @editor.doc.root.focus()
          @editor.selection.restore(savedSelection)
          extNodes = _.clone(@container.querySelectorAll(".#{Tandem.Constants.SPECIAL_CLASSES.EXTERNAL}"))
          _.each(extNodes, (node) ->
            node.parentNode.removeChild(node) if node.parentNode?
          )
          console.log @container.innerHTML
      )
    )



window.Tandem ||= {}
window.Tandem.PasteManager = TandemPasteManager
