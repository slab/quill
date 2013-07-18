Scribe = require('./scribe')
Tandem = require('tandem-core')


class Scribe.PasteManager
  constructor: (@editor) ->
    @container = @editor.root.ownerDocument.createElement('div')
    Scribe.DOM.addClass(@container, 'paste-container')
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles(
      '.paste-container':
        'left': '-10000px'
        'position': 'fixed'
        'top': '50%'
    )
    @editor.renderer.addContainer(@container)
    this.initListeners()

  initListeners: ->
    @editor.root.addEventListener('paste', =>
      oldDocLength = @editor.getLength()
      range = @editor.getSelection()
      return unless range?
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        doc = new Scribe.Document(@container)
        delta = doc.toDelta()
        # Need to remove trailing newline so paste is inline
        delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1))
        lengthAdded = delta.endLength
        delta.ops.unshift(new Tandem.RetainOp(0, range.start.index)) if range.start.index > 0
        delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength)) if range.end.index < oldDocLength
        delta.endLength += (@editor.getLength() - (range.end.index - range.start.index))
        delta.startLength = oldDocLength
        @editor.applyDelta(delta, { source: 'user' })
        @editor.setSelection(new Scribe.Range(@editor, range.start.index + lengthAdded, range.start.index + lengthAdded))
      )
    )


module.exports = Scribe
