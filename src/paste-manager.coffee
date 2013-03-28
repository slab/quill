Scribe = require('./scribe')
Tandem = require('tandem-core')


class Scribe.PasteManager
  constructor: (@editor) ->
    @container = @editor.root.ownerDocument.createElement('div')
    @container.classList.add('paste-container')
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles(
      '.paste-container':
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
        Scribe.Utils.removeExternal(@container)
        Scribe.Utils.removeStyles(@container)
        doc = new Scribe.Document(@container)
        # Need to remove trailing newline so paste is inline
        lastLine = doc.lines.last
        lastLine.deleteText(lastLine.length - 1, 1)
        delta = doc.toDelta()
        delta.ops.unshift(new Tandem.RetainOp(0, selection.start.index)) if selection.start.index > 0
        delta.ops.push(new Tandem.RetainOp(selection.start.index, docLength)) if selection.start.index < docLength
        delta.endLength += docLength
        delta.startLength = docLength
        oldDelta = @editor.doc.toDelta()
        @editor.applyDelta(delta, false)
        lengthAdded = Math.max(0, @editor.getLength() - docLength)
        @editor.setSelection(new Scribe.Range(@editor, selection.start.index + lengthAdded, selection.start.index + lengthAdded))
      )
    )


module.exports = Scribe
