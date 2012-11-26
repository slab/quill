class TandemPasteManager
  constructor: (@editor) ->
    @container = @editor.doc.root.ownerDocument.createElement('div')
    @container.id = 'paste-container'
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles(
      '#paste-container':
        'left': '-10000px'
        'position': 'fixed'
        'top': '50%'
    )
    @editor.doc.root.parentNode.appendChild(@container)
    this.initListeners()

  initListeners: ->
    @editor.doc.root.addEventListener('paste', =>
      @editor.selection.deleteRange()
      selection = @editor.getSelection()
      return unless selection?
      index = selection.start.getIndex()
      return unless index?
      docLength = @editor.doc.length
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        Tandem.Utils.removeExternal(@container)
        Tandem.Utils.removeStyles(@container)
        console.log @container.outerHTML
        doc = new Tandem.Document(@container)
        delta = doc.toDelta()
        delta.deltas.unshift(new JetRetain(0, index)) if index > 0
        delta.deltas.push(new JetRetain(index, docLength)) if index < docLength
        delta.endLength += docLength
        delta.startLength = docLength
        console.log 'pasted', delta
        @editor.applyDelta(delta)
        @editor.doc.root.focus()
        lengthAdded = Math.max(0, @editor.doc.length - docLength)
        @editor.setSelection(new Tandem.Range(@editor, index + lengthAdded, index + lengthAdded))
      )
    )



window.Tandem ||= {}
window.Tandem.PasteManager = TandemPasteManager
