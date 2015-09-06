Quill     = require('../quill')
extend    = require('extend')
Delta     = Quill.require('delta')
Parchment = Quill.require('parchment')


sanitize = (container) ->
  # TODO this needs to be Editor for getDelta to work
  doc = new Parchment.Container(container)
  delta = doc.getDelta()
  lengthAdded = delta.length()
  return delta if lengthAdded == 0
  # Need to remove trailing newline so paste is inline,
  # losing format is expected and observed in Word
  return delta.compose(new Delta().retain(lengthAdded - 1).delete(1))


class PasteManager
  @DEFAULTS:
    sanitize: sanitize

  constructor: (@quill, options = {}) ->
    @options = extend({}, PasteManager.DEFAULTS, options)
    @container = @quill.addContainer('ql-paste-manager')
    @container.setAttribute('contenteditable', true)
    @container.setAttribute('tabindex', '-1')
    @quill.root.addEventListener('paste', this.onPaste.bind(this))

  onPaste: ->
    range = @quill.getSelection()
    return unless range?
    oldDocLength = @quill.getLength()
    @container.focus()
    setTimeout( =>
      pasteDelta = @options.sanitize(@container)
      lengthAdded = pasteDelta.length()
      if lengthAdded > 0
        delta = new Delta()
        delta.retain(range.start) if range.start > 0
        delta.delete(range.end - range.start)
        delta = delta.concat(pasteDelta)
        @quill.updateContents(delta, Quill.sources.USER)
      @quill.setSelection(range.start + lengthAdded, range.start + lengthAdded)
      # Make sure bottom of pasted content is visible
      @quill.scrollIntoView()
      @container.innerHTML = ""
    , 0)


Quill.registerModule('paste-manager', PasteManager)
module.exports = PasteManager
