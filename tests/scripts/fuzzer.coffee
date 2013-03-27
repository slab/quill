$(document).ready( ->
  $editors = $('.editor-container')
  window.writer = new Scribe.Editor($editors.get(0))
  writerToolbar = new Scribe.Toolbar('editor-toolbar-writer', writer)
)
