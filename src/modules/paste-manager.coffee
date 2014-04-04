_        = require('lodash')
DOM      = require('../dom')
Document = require('../document')
Tandem   = require('tandem-core')


class PasteManager
  constructor: (@quill, @editorContainer, @options) ->
    @container = @quill.addContainer('paste-container')
    @container.setAttribute('contenteditable', true)
    @quill.addStyles(
      '.paste-container':
        'left': '-10000px'
        'position': 'absolute'
        'top': '50%'
    )
    this.initListeners()

  initListeners: ->
    DOM.addEventListener(@editorContainer.ownerDocument, 'paste', =>
      oldDocLength = @quill.getLength()
      range = @quill.getSelection()
      return unless range?
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        doc = new Document(@container, @quill.options)
        delta = doc.toDelta()
        lengthAdded = delta.endLength
        delta.ops.unshift(new Tandem.RetainOp(0, range.start.index)) if range.start.index > 0
        delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength)) if range.end.index < oldDocLength
        delta.endLength += (@quill.getLength() - (range.end.index - range.start.index))
        delta.startLength = oldDocLength
        @quill.updateContents(delta, { source: 'user' })
        @quill.focus()
        @quill.setSelection(range.start.index + lengthAdded, range.start.index + lengthAdded)
      )
    )


module.exports = PasteManager
