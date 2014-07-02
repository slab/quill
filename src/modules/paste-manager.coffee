_        = require('lodash')
DOM      = require('../dom')
Document = require('../document')
Tandem   = require('tandem-core')


class PasteManager
  constructor: (@quill, @options) ->
    @container = @quill.addContainer('paste-container')
    @container.setAttribute('contenteditable', true)
    @quill.addStyles(
      '.paste-container':
        'left': '-10000px'
        'position': 'absolute'
        'top': '50%'
    )
    DOM.addEventListener(@quill.root, 'paste', _.bind(this._paste, this))

  _paste: ->
    oldDocLength = @quill.getLength()
    range = @quill.getSelection()
    return unless range?
    @container.innerHTML = ""
    iframe = @quill.root.ownerDocument.defaultView
    scrollY = iframe.scrollY
    @container.focus()
    _.defer( =>
      doc = new Document(@container, @quill.options)
      delta = doc.toDelta()
      # Need to remove trailing newline so paste is inline, losing format is expected and observed in Word
      delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1))
      lengthAdded = delta.endLength
      delta.ops.unshift(new Tandem.RetainOp(0, range.start)) if range.start > 0
      delta.ops.push(new Tandem.RetainOp(range.end, oldDocLength)) if range.end < oldDocLength
      delta.endLength += (@quill.getLength() - (range.end - range.start))
      delta.startLength = oldDocLength
      @quill.updateContents(delta, 'user')
      @quill.focus()
      @quill.setSelection(range.start + lengthAdded, range.start + lengthAdded)
      iframe.scrollTo(0, scrollY)
    )


module.exports = PasteManager
