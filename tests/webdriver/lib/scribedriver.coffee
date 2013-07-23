$(document).ready( ->
  $editors = $('.editor-container')
  window.editor = new Scribe.Editor($editors.get(0))
  editorToolbar = new Scribe.Toolbar('editor-toolbar', editor)
  window.ScribeDriver =
    resetScribe: ->
      $('.editor-container').html($('#editor-cache').html())
      window.editor = new Scribe.Editor($editors.get(0))

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
      window.ScribeDriver[deltaRef] =
        new window.Tandem.Delta(d.startLength, d.endLength, d.ops)

    createDelta: (template) ->
      startLength = template['startLength']
      endLength = template['endLength']
      ops = _.map(template['ops'], (op) ->
        if op['value']?
          return new window.Tandem.InsertOp(op['value'], op['attributes'])
        else if op['start']?
          return new window.Tandem.RetainOp(op['start'], op['end'], op['attributes'])
        else
          throw "Receive op that is not insert or retain: #{JSON.stringify(op)}"
      )
      return new window.Tandem.Delta(startLength, endLength, ops)

    autoFormatDelta: (delta) ->
      appendingToLine = (index) ->
        op = window.ScribeDriver.docDelta.getOpsAt(index, 1)
        return op.length > 0 and _.first(op).value == "\n"

      prependingToLine = (index) ->
        op = window.ScribeDriver.docDelta.getOpsAt(index - 1, 1)
        return index == 0 or (op.length > 0 and _.first(op).value == "\n")

      getAttrsAt = (index) ->
        attrs = {}
        op = _.first(window.ScribeDriver.docDelta.getOpsAt(index, 1))
        attrs = op.attributes if op
        return attrs

      index = 0
      for op, opIndex in delta.ops
        if window.Tandem.Delta.isInsert op
          precedingAttrs = followingAttrs = {}
          if appendingToLine(index)
            precedingAttrs = getAttrsAt(index - 1)
            delete precedingAttrs['link'] if precedingAttrs['link']?
          else if prependingToLine(index)
            precedingAttrs = followingAttrs = getAttrsAt(index)
            delete precedingAttrs['link'] if precedingAttrs['link']?
            delete followingAttrs['link'] if followingAttrs['link']?
          else
            precedingAttrs = getAttrsAt(index - 1)
            followingAttrs = getAttrsAt(index)
            delete followingAttrs['link'] if followingAttrs['link']
          chunks = op.value.split("\n")
          head = _.first(chunks)
          tail = _.tail(chunks)
          head = new window.Tandem.InsertOp(head, precedingAttrs)
          tail = _.map(tail, (elem) ->
            return new window.Tandem.InsertOp(elem, followingAttrs)
          )
          final = [head]
          for elem in tail
            final.push(new window.Tandem.InsertOp("\n"))
            final.push(elem)
          delta.ops.splice(opIndex, 1, final...)
          delta.compact()
          return delta
        else
          index += op.getLength()

      return delta

    createRandomDelta: ->
      randomDelta = window.Tandem.DeltaGen.getRandomDelta(window.ScribeDriver.docDelta, 1)
      return window.ScribeDriver.autoFormatDelta(randomDelta)

    initializeScribe: ->
      window.editor.setDelta(window.ScribeDriver.docDelta)

    checkConsistency: ->
      actual = window.ScribeDriver.cleanup(editor.getDelta())
      window.ScribeDriver.docDelta.compose(window.ScribeDriver.currentDelta).isEqual(actual)
)
