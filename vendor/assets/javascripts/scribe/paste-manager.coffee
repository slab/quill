class ScribePasteManager
  constructor: (@editor) ->
    @container = @editor.root.ownerDocument.createElement('div')
    @container.id = 'paste-container'
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles(
      '#paste-container':
        'left': '-10000px'
        'position': 'fixed'
        'top': '50%'
    )
    @editor.root.parentNode.appendChild(@container)
    this.initListeners()

  initListeners: ->
    @editor.root.addEventListener('paste', =>
      @editor.selection.deleteRange()
      selection = @editor.getSelection()
      return unless selection?
      docLength = @editor.getLength()
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        console.log @container.innerHTML
        Scribe.Utils.removeExternal(@container)
        Scribe.Utils.removeStyles(@container)
        doc = new Scribe.Document(@container)
        delta = doc.toDelta()
        console.log delta
        delta.ops.unshift(new Tandem.RetainOp(0, selection.start.index)) if selection.start.index > 0
        delta.ops.push(new Tandem.RetainOp(selection.start.index, docLength)) if selection.start.index < docLength
        delta.endLength += docLength
        delta.startLength = docLength
        oldDelta = @editor.doc.toDelta()
        @editor.applyDelta(delta, false)
        @editor.root.focus()
        lengthAdded = Math.max(0, @editor.getLength() - docLength)
        @editor.setSelection(new Scribe.Range(@editor, selection.start.index + lengthAdded, selection.start.index + lengthAdded))
      )
    )


window.Scribe or= {}
window.Scribe.PasteManager = ScribePasteManager
