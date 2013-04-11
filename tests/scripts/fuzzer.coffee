$(document).ready( ->
  $editors = $('.editor-container')
  window.writer = new Scribe.Editor($editors.get(0))
  writerToolbar = new Scribe.Toolbar('editor-toolbar-writer', writer)
  window.Fuzzer = cleanup: (delta) ->
    NBSP_FILTER = /\u00a0/g
    for op in delta.ops
      if window.Tandem.Delta.isInsert op
        op.value = op.value.replace(NBSP_FILTER, " ")
    return delta
)
