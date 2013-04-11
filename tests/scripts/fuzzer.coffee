$(document).ready( ->
  $editors = $('.editor-container')
  window.writer = new Scribe.Editor($editors.get(0))
  writerToolbar = new Scribe.Toolbar('editor-toolbar-writer', writer)
  window.Fuzzer =
    cleanup: (delta) ->
      NBSP_FILTER = /\u00a0/g
      for op in delta.ops
        if window.Tandem.Delta.isInsert op
          op.value = op.value.replace(NBSP_FILTER, " ")
      return delta

    get: (ref) ->
      window.Fuzzer[ref]

    toStr: (obj) ->
      JSON.stringify(obj)

    getEditorDelta: ->
      window.writer.getDelta()

    set: (ref, val) ->
      window.Fuzzer[ref] = val

    setDeltaReplay: (docDelta, deltaRef) ->
      d = JSON.parse(docDelta)
      window.Fuzzer[deltaRef] =
        new window.Tandem.Delta(d.startLength, d.endLength, d.ops)

    createRandomDelta: ->
      window.Tandem.DeltaGen.getRandomDelta(window.Fuzzer.docDelta, 1)

    initializeScribe: ->
      window.writer.setDelta(window.Fuzzer.docDelta)
)
