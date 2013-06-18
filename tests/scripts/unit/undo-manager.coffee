describe('Undo manager', ->
  describe('undo/redo', ->
    tests = 
      'insert':
        initial: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 18, [new Tandem.RetainOp(0, 9), new Tandem.InsertOp('hairy '), new Tandem.RetainOp(9, 12)])
        expected: new Tandem.Delta(18, 12, [new Tandem.RetainOp(0, 9), new Tandem.RetainOp(15, 18)])
      'delete':
        initial: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 7, [new Tandem.RetainOp(0, 4), new Tandem.RetainOp(9, 12)])
        expected: new Tandem.Delta(7, 12, [new Tandem.RetainOp(0, 4), new Tandem.InsertOp('lazy '), new Tandem.RetainOp(4, 7)])
      'insert and delete':
        initial: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 13, [new Tandem.RetainOp(0, 4), new Tandem.InsertOp('hairy '), new Tandem.RetainOp(9, 12)])
        expected: new Tandem.Delta(13, 12, [new Tandem.RetainOp(0, 4), new Tandem.InsertOp('lazy '), new Tandem.RetainOp(10, 13)])
      'delete at end':
        initial: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 9, [new Tandem.RetainOp(0, 9)])
        expected: new Tandem.Delta(9, 12, [new Tandem.RetainOp(0, 9), new Tandem.InsertOp('fox')])
      'append':
        initial: new Tandem.Delta(0, 8, [new Tandem.InsertOp("The lazy")])
        change: new Tandem.Delta(8, 12, [new Tandem.RetainOp(0, 8), new Tandem.InsertOp(' fox')])
        expected: new Tandem.Delta(12, 8, [new Tandem.RetainOp(0, 8)])
      'replace':
        initial: new Tandem.Delta(0, 3, [new Tandem.InsertOp("fox")])
        change: new Tandem.Delta(3, 4, [new Tandem.InsertOp("lazy")])
        expected: new Tandem.Delta(4, 3, [new Tandem.InsertOp("fox")])


    undoTests = new Scribe.Test.EditorTest()
    _.each(tests, (test, name) ->
      undoTests.run(name, 
        initial: test.initial
        expected: test.expected
        fn: (editor) ->
          editor.applyDelta(test.change)
        checker: (editor) ->
          editor.undoManager.undo()
          expect(editor.getDelta()).to.deep.equal(test.initial)
          editor.undoManager.redo()
      )
    )
  )
)
