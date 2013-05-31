$(document).ready( ->
  $editors = $('.editor-container')
  window.editor = new Scribe.Editor($editors.get(0))
  editorToolbar = new Scribe.Toolbar('editor-toolbar', editor)
  window.Fuzzer =
    getActiveFormats: ->
      actives = $('#editor-toolbar > .active')
      _.map(actives, (elem) ->
        $(elem).html().toLowerCase()
      )

    cleanup: (delta) ->
      NBSP_FILTER = /\u00a0/g
      for op in delta.ops
        if window.Tandem.Delta.isInsert op
          op.value = op.value.replace(NBSP_FILTER, " ")
      return delta

    setDeltaReplay: (docDelta, deltaRef) ->
      d = JSON.parse(docDelta)
      window.Fuzzer[deltaRef] =
        new window.Tandem.Delta(d.startLength, d.endLength, d.ops)

    createRandomDelta: ->
      randomDelta = window.Tandem.DeltaGen.getRandomDelta(window.Fuzzer.docDelta, 1)

      # Is the preceding char a newline?
      hasTrailingText = (index) ->
        if index == 0 then return true
        return window.Fuzzer.docDelta.getOpsAt(index - 1, 1) != "\n"

      index = 0
      for op, opIndex in randomDelta.ops
        if window.Tandem.Delta.isInsert op
          chunks = op.value.split('\n')
          if chunks.length > 1
            if !hasTrailingText(index)
              head = new window.Fuzzer.Tandem.InsertOp(_.first(chunks))
              rest = new window.Fuzzer.Tandem.InsertOp("\n" + _.rest(chunks).join("\n"))
              randomDelta.ops.splice(opIndex, 1, head, rest)
              op = head
            else


          if !hasTrailingText(index)
            firstNewline = op.value.indexOf('\n')
            if firstNewline != -1
              [head, tail] = op.split(firstNewline)
              randomDelta.ops.splice(opIndex, 1, head, tail)
              op = head
          if index == 0
            attrRef = window.Fuzzer.docDelta.getOpsAt(0, 1)[0]
          else
            attrRef = window.Fuzzer.docDelta.getOpsAt(index - 1, 1)[0]
          op.attributes = _.clone(attrRef.attributes)
          return randomDelta
        else
          index += op.getLength()
      return randomDelta

    initializeScribe: ->
      window.editor.setDelta(window.Fuzzer.docDelta)

    checkConsistency: ->
      actual = window.Fuzzer.cleanup(editor.getDelta())
      window.Fuzzer.docDelta.compose(window.Fuzzer.randomDelta).isEqual(actual)
)
