describe('Undo manager', ->
  describe('computeUndo', ->
    tests = 
      'insert':
        original: new JetDelta(0, 12, [new JetInsert("The lazy fox")])
        change: new JetDelta(12, 18, [new JetRetain(0, 9), new JetInsert('hairy '), new JetRetain(9, 12)])
        expected: new JetDelta(18, 12, [new JetRetain(0, 9), new JetRetain(15, 18)])
      'delete':
        original: new JetDelta(0, 12, [new JetInsert("The lazy fox")])
        change: new JetDelta(12, 7, [new JetRetain(0, 4), new JetRetain(9, 12)])
        expected: new JetDelta(7, 12, [new JetRetain(0, 4), new JetInsert('lazy '), new JetRetain(4, 7)])
      'insert and delete':
        original: new JetDelta(0, 12, [new JetInsert("The lazy fox")])
        change: new JetDelta(12, 13, [new JetRetain(0, 4), new JetInsert('hairy '), new JetRetain(9, 12)])
        expected: new JetDelta(13, 12, [new JetRetain(0, 4), new JetInsert('lazy '), new JetRetain(10, 13)])
      'delete at end':
        original: new JetDelta(0, 12, [new JetInsert("The lazy fox")])
        change: new JetDelta(12, 9, [new JetRetain(0, 9)])
        expected: new JetDelta(9, 12, [new JetRetain(0, 9), new JetInsert('fox')])
      'append':
        original: new JetDelta(0, 8, [new JetInsert("The lazy")])
        change: new JetDelta(8, 12, [new JetRetain(0, 8), new JetInsert(' fox')])
        expected: new JetDelta(12, 8, [new JetRetain(0, 8)])
      'replace':
        original: new JetDelta(0, 3, [new JetInsert("fox")])
        change: new JetDelta(3, 4, [new JetInsert("lazy")])
        expected: new JetDelta(4, 3, [new JetInsert("fox")])


    _.each(tests, (test, name) ->
      it(name, ->
        undoDelta = Scribe.UndoManager.computeUndo(test.change, test.original)
        expect(undoDelta).to.deep.equal(test.expected)
      )
    )
  )
)
