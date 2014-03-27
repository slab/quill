_        = require('lodash')
DOM      = require('../dom')
Document = require('../document')
Tandem   = require('tandem-core')


class PasteManager
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
    DOM.addEventListener(@editorContainer.ownerDocument, 'paste', =>
      oldDocLength = @scribe.getLength()
      range = @scribe.getSelection()
      return unless range?
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        doc = new Document(@container, @scribe.options)
        delta = doc.toDelta()
        lengthAdded = delta.endLength
        delta.ops.unshift(new Tandem.RetainOp(0, range.start.index)) if range.start.index > 0
        delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength)) if range.end.index < oldDocLength
        delta.endLength += (@scribe.getLength() - (range.end.index - range.start.index))
        delta.startLength = oldDocLength
        @scribe.updateContents(delta, { source: 'user' })
        @scribe.focus()
        @scribe.setSelection(range.start.index + lengthAdded, range.start.index + lengthAdded)
      )
    )


module.exports = PasteManager
