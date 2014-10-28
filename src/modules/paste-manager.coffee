Quill    = require('../quill')
Document = require('../core/document')
_        = Quill.require('lodash')
dom      = Quill.require('dom')
Delta    = Quill.require('delta')

class PasteManager
  constructor: (@quill, @options) ->
    @container = @quill.addContainer('ql-paste-manager')
    @container.setAttribute('contenteditable', true)
    dom(@quill.root).on('paste', _.bind(this._paste, this))

  _paste: ->
    oldDocLength = @quill.getLength()
    range = @quill.getSelection()
    return unless range?
    @container.innerHTML = ""
    windowScrollX = window.scrollX
    windowScrollY = window.scrollY
    @container.focus()
    _.defer( =>
      doc = new Document(@container, @quill.options)
      delta = doc.toDelta()
      lengthAdded = delta.length() - 1
      # Need to remove trailing newline so paste is inline, losing format is expected and observed in Word
      delta.compose(new Delta().retain(lengthAdded).delete(1))
      delta.ops.unshift({ retain: range.start }) if range.start > 0
      delta.delete(range.end - range.start)
      @quill.updateContents(delta, 'user')
      @quill.setSelection(range.start + lengthAdded, range.start + lengthAdded)
      [line, offset] = @quill.editor.doc.findLineAt(range.start + lengthAdded)
      lineBottom = line.node.offsetTop + line.node.offsetHeight
      if lineBottom > iframeScrollY + @quill.root.offsetHeight
        iframeScrollY = line.node.offsetTop - @quill.root.offsetHeight / 2
      window.scrollTo(windowScrollX, windowScrollY)
    )


Quill.registerModule('paste-manager', PasteManager)
module.exports = PasteManager
