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
        delta.ops.unshift(new Tandem.RetainOp(0, range.start)) if range.start > 0
        delta.ops.push(new Tandem.RetainOp(range.end, oldDocLength)) if range.end < oldDocLength
        delta.endLength += (@quill.getLength() - (range.end - range.start))
        delta.startLength = oldDocLength
        @quill.updateContents(delta, { source: 'user' })
        @quill.focus()
        @quill.setSelection(range.start + lengthAdded, range.start + lengthAdded)
      )
    )


module.exports = PasteManager
