describe('Undo manager', ->
  describe('computeUndo', ->
    tests = 
      'insert':
        original: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 18, [new Tandem.RetainOp(0, 9), new Tandem.InsertOp('hairy '), new Tandem.RetainOp(9, 12)])
        expected: new Tandem.Delta(18, 12, [new Tandem.RetainOp(0, 9), new Tandem.RetainOp(15, 18)])
      'delete':
        original: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 7, [new Tandem.RetainOp(0, 4), new Tandem.RetainOp(9, 12)])
        expected: new Tandem.Delta(7, 12, [new Tandem.RetainOp(0, 4), new Tandem.InsertOp('lazy '), new Tandem.RetainOp(4, 7)])
      'insert and delete':
        original: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 13, [new Tandem.RetainOp(0, 4), new Tandem.InsertOp('hairy '), new Tandem.RetainOp(9, 12)])
        expected: new Tandem.Delta(13, 12, [new Tandem.RetainOp(0, 4), new Tandem.InsertOp('lazy '), new Tandem.RetainOp(10, 13)])
      'delete at end':
        original: new Tandem.Delta(0, 12, [new Tandem.InsertOp("The lazy fox")])
        change: new Tandem.Delta(12, 9, [new Tandem.RetainOp(0, 9)])
        expected: new Tandem.Delta(9, 12, [new Tandem.RetainOp(0, 9), new Tandem.InsertOp('fox')])
      'append':
        original: new Tandem.Delta(0, 8, [new Tandem.InsertOp("The lazy")])
        change: new Tandem.Delta(8, 12, [new Tandem.RetainOp(0, 8), new Tandem.InsertOp(' fox')])
        expected: new Tandem.Delta(12, 8, [new Tandem.RetainOp(0, 8)])
      'replace':
        original: new Tandem.Delta(0, 3, [new Tandem.InsertOp("fox")])
        change: new Tandem.Delta(3, 4, [new Tandem.InsertOp("lazy")])
        expected: new Tandem.Delta(4, 3, [new Tandem.InsertOp("fox")])


    _.each(tests, (test, name) ->
      it(name, ->
        undoDelta = Scribe.UndoManager.computeUndo(test.change, test.original)
        expect(undoDelta.isEqual(test.expected)).to.be.true
      )
    )
  )
)
