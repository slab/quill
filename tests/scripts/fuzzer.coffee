ALPHABET = "abcdefghijklmnopqrstuvwxyz\n\n\n\n\n\t\t\t   ".split('')
FORMATS = _.extend({}, Scribe.Constants.SPAN_FORMATS, Scribe.Constants.TAG_FORMATS)
NUM_OPERATIONS = 500

$(document).ready( ->
  $editors = $('.editor-container')
  window.writer = new Scribe.Editor($editors.get(0))
  window.reader = new Scribe.Editor($editors.get(1))
  writerToolbar = new Scribe.Toolbar('editor-toolbar-writer', writer)
  readerToolbar = new Scribe.Toolbar('editor-toolbar-reader', reader)
)
