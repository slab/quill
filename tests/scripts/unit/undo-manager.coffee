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
        expect(editor.getDelta()).to.deep.equal(initial)
        editor.undoManager.redo()
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
  )
)
