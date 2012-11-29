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
      index = selection.start.getIndex()
      return unless index?
      docLength = @editor.doc.length
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        Scribe.Utils.removeExternal(@container)
        Scribe.Utils.removeStyles(@container)
        doc = new Scribe.Document(@container)
        doc.trailingNewline = false
        doc.length -= 1
        delta = doc.toDelta()
        delta.deltas.unshift(new JetRetain(0, index)) if index > 0
        delta.deltas.push(new JetRetain(index, docLength)) if index < docLength
        delta.endLength += docLength
        delta.startLength = docLength
        oldDelta = @editor.doc.toDelta()
        @editor.applyDelta(delta)
        @editor.undoManager.record(delta, oldDelta)
        @editor.root.focus()
        lengthAdded = Math.max(0, @editor.doc.length - docLength)
        @editor.setSelection(new Scribe.Range(@editor, index + lengthAdded, index + lengthAdded))
      )
    )



window.Scribe ||= {}
window.Scribe.PasteManager = ScribePasteManager
