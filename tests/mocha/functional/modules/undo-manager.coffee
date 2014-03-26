Tandem = require('tandem-core')
ScribeEditorTest = require('../../lib/editor-test')


describe('Undo Manager', ->
  describe('undo/redo', ->
    undoTests = new ScribeEditorTest(
      initial: Tandem.Delta.getInitial("The lazy fox\n")
      ignoreExpect: true
      fn: (scribe, expectedScribe, delta) ->
        scribe.getModule('undo-manager').clear()
        scribe.editor.applyDelta(delta, { source: 'user' })
      checker: (scribe, expectedEditor, delta) ->
        beforeDelta = scribe.getContents()
        scribe.getModule('undo-manager').undo()
        expect(scribe.getContents().isEqual(@options.initial)).to.be(true)
        scribe.getModule('undo-manager').redo()
        expect(scribe.getContents().isEqual(beforeDelta)).to.be(true)
    )

    undoTests.run('insert', {}, Tandem.Delta.makeInsertDelta(13, 9, 'hairy '))

    undoTests.run('delete', {}, Tandem.Delta.makeDeleteDelta(13, 4, 5))

    undoTests.run('replace', {}, new Tandem.Delta(13, [
      new Tandem.RetainOp(0, 4)
      new Tandem.InsertOp('hairy ')
      new Tandem.RetainOp(9, 13)
    ]))

    undoTests.run('replace all', {}, new Tandem.Delta(13, [new Tandem.InsertOp('A fast bunny\n')]))

    boldDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { bold: true })
    undoTests.run('insert attribute', {}, boldDelta)

    unboldDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { bold: null })
    undoTests.run('remove attribute', {
      initial: Tandem.Delta.getInitial("The lazy fox\n").compose(boldDelta)
    }, unboldDelta)

    blueStrikeDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { 'fore-color': 'blue', strike: true })
    undoTests.run('insert color/strike', {}, blueStrikeDelta)

    undoBlueStrikeDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { 'fore-color': null, strike: null })
    undoTests.run('remove color/strike', {
      initial: Tandem.Delta.getInitial("The lazy fox\n").compose(blueStrikeDelta)
    }, undoBlueStrikeDelta)

    # Multi-user
    undoTests.run('remove external insert',
      fn: (scribe, expectedScribe, delta) ->
        scribe.getModule('undo-manager').clear()
        scribe.editor.applyDelta(delta, { source: 'api' })
    , Tandem.Delta.makeInsertDelta(13, 9, 'hairy '))

    undoTests.run('remove external delete',
      fn: (scribe, expectedScribe, delta) ->
        scribe.getModule('undo-manager').clear()
        scribe.editor.applyDelta(delta, { source: 'api' })
    , Tandem.Delta.makeDeleteDelta(13, 4, 5))

    undoTests.run('remove external replace',
      fn: (scribe, expectedScribe, delta) ->
        scribe.getModule('undo-manager').clear()
        scribe.editor.applyDelta(delta, { source: 'api' })
    , new Tandem.Delta(13, [
        new Tandem.RetainOp(0, 4)
        new Tandem.InsertOp('hairy ')
        new Tandem.RetainOp(9, 13)
      ])
    )

    undoTests.run('remove external replace all',
      fn: (scribe, expectedScribe, delta) ->
        scribe.getModule('undo-manager').clear()
        scribe.editor.applyDelta(delta, { source: 'api' })
      , new Tandem.Delta(13, [new Tandem.InsertOp('A fast bunny\n')])
    )
  )
)