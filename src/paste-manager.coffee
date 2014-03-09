_               = require('lodash')
ScribeDOM       = require('./dom')
ScribeDocument  = require('./document')
ScribeRange     = require('./range')
Tandem          = require('tandem-core')


class ScribePasteManager
  constructor: (@editor) ->
    @container = @editor.root.ownerDocument.createElement('div')
    ScribeDOM.addClass(@container, 'paste-container')
    @container.setAttribute('contenteditable', true)
    @editor.renderer.addStyles(
      '.paste-container':
        'left': '-10000px'
        'position': 'absolute'
        'top': '50%'
    )
    @editor.renderer.addContainer(@container)
    this.initListeners()

  initListeners: ->
    ScribeDOM.addEventListener(@editor.root, 'paste', =>
      oldDocLength = @editor.scribe.getLength()
      range = @editor.getSelection()
      return unless range?
      @container.innerHTML = ""
      @container.focus()
      _.defer( =>
        doc = new ScribeDocument(@container, @editor.options)
        delta = doc.toDelta()
        # Need to remove trailing newline so paste is inline
        delta = delta.compose(Tandem.Delta.makeDeleteDelta(delta.endLength, delta.endLength - 1, 1))
        lengthAdded = delta.endLength
        delta.ops.unshift(new Tandem.RetainOp(0, range.start.index)) if range.start.index > 0
        delta.ops.push(new Tandem.RetainOp(range.end.index, oldDocLength)) if range.end.index < oldDocLength
        delta.endLength += (@editor.scribe.getLength() - (range.end.index - range.start.index))
        delta.startLength = oldDocLength
        @editor.applyDelta(delta, { source: 'user' })
        @editor.root.focus()
        @editor.setSelection(new ScribeRange(@editor, range.start.index + lengthAdded, range.start.index + lengthAdded))
      )
    )


module.exports = ScribePasteManager
