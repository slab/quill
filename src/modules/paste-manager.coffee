_               = require('lodash')
ScribeDOM       = require('../dom')
ScribeDocument  = require('../document')
ScribeRange     = require('../range')
Tandem          = require('tandem-core')


class ScribePasteManager
  constructor: (@scribe, @editorContainer, @options) ->
    @container = @scribe.addContainer('paste-container')
    @container.setAttribute('contenteditable', true)
    @scribe.addStyles(
      '.paste-container':
        'left': '-10000px'
        'position': 'absolute'
        'top': '50%'
    )
    this.initListeners()

  initListeners: ->
    ScribeDOM.addEventListener(@editorContainer.ownerDocument, 'paste', =>
      oldDocLength = @scribe.getLength()
      range = @scribe.getSelection()
      return unless range?
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        doc = new ScribeDocument(@container, @scribe.editor.options)
        delta = doc.toDelta()
        # Need to remove trailing newline so paste is inline
        delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1))
        lengthAdded = delta.endLength
        delta.ops.unshift(new Tandem.RetainOp(0, range.start.index)) if range.start.index > 0
        delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength)) if range.end.index < oldDocLength
        delta.endLength += (@scribe.getLength() - (range.end.index - range.start.index))
        delta.startLength = oldDocLength
        @scribe.editor.applyDelta(delta, { source: 'user' })
        @editorContainer.focus()
        @scribe.setSelection(new ScribeRange(@scribe.editor, range.start.index + lengthAdded, range.start.index + lengthAdded))
      )
    )


module.exports = ScribePasteManager
