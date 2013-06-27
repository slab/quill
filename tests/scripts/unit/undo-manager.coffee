describe('Undo manager', ->
  describe('undo/redo', ->
    initial = Tandem.Delta.getInitial("The lazy fox\n")
    undoTests = new Scribe.Test.EditorTest(
      initial: initial
      ignoreExpect: true
      fn: (editor, expectedEditor, delta) ->
        editor.applyDelta(delta, { source: 'user' })
      checker: (editor, expectedEditor, delta) ->
        editor.undoManager.undo()
        console.log(editor.getDelta())
        console.log(initial)
        expect(editor.getDelta()).to.deep.equal(initial)
        editor.undoManager.redo()
        console.log(editor.getDelta())
        console.log(initial.compose(delta))
        expect(editor.getDelta()).to.deep.equal(initial.compose(delta))
    )

    undoTests.run('insert', {}, Tandem.Delta.makeInsertDelta(13, 9, 'hairy '))

    undoTests.run('delete', {}, Tandem.Delta.makeDeleteDelta(13, 4, 5))

    undoTests.run('replace', {}, new Tandem.Delta(13, [
      new Tandem.RetainOp(0, 4)
      new Tandem.InsertOp('hairy ')
      new Tandem.RetainOp(9, 13)
    ]))

    undoTests.run('replace all', {}, new Tandem.Delta(13, [new Tandem.InsertOp('A fast bunny\n')]))

    undoTests.run('insert attribute', {}, new Tandem.Delta(13, [new Tandem.RetainOp(0, 13, {bold: true})]))


    undoTests.initial.compose(new Tandem.Delta(13, [new Tandem.RetainOp(0, 13, {bold: true})]))
    undoTests.run('remove attribute', {}, new Tandem.Delta(13, [new Tandem.RetainOp(0, 13)]))
  )
)