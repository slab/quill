describe('Undo Manager', ->
  describe('undo/redo', ->
    undoTests = new Scribe.Test.EditorTest(
      initial: Tandem.Delta.getInitial("The lazy fox\n")
      ignoreExpect: true
      fn: (editor, expectedEditor, delta) ->
        editor.applyDelta(delta, { source: 'user' })
      checker: (editor, expectedEditor, delta) ->
        beforeDelta = editor.getDelta()
        editor.undoManager.undo()
        expect(editor.getDelta().isEqual(@options.initial)).to.be(true)
        editor.undoManager.redo()
        expect(editor.getDelta().isEqual(beforeDelta)).to.be(true)
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

    unboldDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { bold: false })
    undoTests.run('remove attribute', { 
      initial: Tandem.Delta.getInitial("The lazy fox\n").compose(boldDelta) 
    }, unboldDelta)

    blueStrikeDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { color: 'blue', strike: true })
    undoTests.run('insert color/strike', {}, blueStrikeDelta)

    undoBlueStrikeDelta = Tandem.Delta.makeRetainDelta(13, 0, 12, { color: false, strike: false })
    undoTests.run('remove color/strike', { 
      initial: Tandem.Delta.getInitial("The lazy fox\n").compose(blueStrikeDelta) 
    }, undoBlueStrikeDelta)

    # Multi-user
    undoTests.run('remove external insert', 
      fn: (editor, expectedEditor, delta) -> 
        editor.applyDelta(delta, { source: 'api' })
    , Tandem.Delta.makeInsertDelta(13, 9, 'hairy '))

    undoTests.run('remove external delete',
      fn: (editor, expectedEditor, delta) -> 
        editor.applyDelta(delta, { source: 'api' }) 
    , Tandem.Delta.makeDeleteDelta(13, 4, 5))

    undoTests.run('remove external replace',
      fn: (editor, expectedEditor, delta) -> 
        editor.applyDelta(delta, { source: 'api' })
    , new Tandem.Delta(13, [
        new Tandem.RetainOp(0, 4)
        new Tandem.InsertOp('hairy ')
        new Tandem.RetainOp(9, 13)
      ])
    )

    undoTests.run('remove external replace all', 
      fn: (editor, expectedEditor, delta) -> 
        editor.applyDelta(delta, { source: 'api' })
      , new Tandem.Delta(13, [new Tandem.InsertOp('A fast bunny\n')])
    )
  )
)