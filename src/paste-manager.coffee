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
      oldDocLength = @editor.getLength()
      range = @editor.getSelection()
      return unless range?
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        console.log @container.innerHTML
        Scribe.Utils.removeExternal(@container)
        doc = new Scribe.Document(@container, @editor.renderer)
        # Need to remove trailing newline so paste is inline
        lastLine = doc.lines.last
        lastLine.deleteText(lastLine.length - 1, 1)
        delta = doc.toDelta()
        lengthAdded = delta.endLength
        delta.ops.unshift(new Tandem.RetainOp(0, range.start.index)) if range.start.index > 0
        delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength)) if range.end.index < oldDocLength
        delta.endLength += (@editor.getLength() - (range.end.index - range.start.index))
        delta.startLength = oldDocLength
        @editor.applyDelta(delta, false)
        @editor.setSelection(new Scribe.Range(@editor, range.start.index + lengthAdded, range.start.index + lengthAdded))
      )
    )


module.exports = Scribe
