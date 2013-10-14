describe('Editor', ->
  describe('preserve trailing newline', ->
    preserveTests = new ScribeEditorTest(
      initial:  Tandem.Delta.getInitial('Test\n')
      expected: Tandem.Delta.getInitial('Tes\n')
    )

    preserveTests.run('delete last chars',
      fn: (editor) ->
        editor.deleteAt(3, 2)
    )

    preserveTests.run('delete last chars with applyDelta',
      fn: (editor) ->
        editor.applyDelta(Tandem.Delta.makeDeleteDelta(5, 3, 2))
    )

    preserveTests.run('insert text after newline',
      expected: Tandem.Delta.getInitial('Test\ns\n')
      fn: (editor) ->
        editor.insertAt(5, 's')
    )
  )

  describe('applyDelta', ->
    applyTests = new ScribeEditorTest(
      fn: (testEditor, expectedEditor, ops) ->
        delta = new Tandem.Delta(testEditor.getLength(), ops)
        testEditor.applyDelta(delta)
    )

    applyTests.run('apply to empty',
      initial:  []
      expected: ['<div><span>0123</span></div>']
    , [new Tandem.InsertOp("0123\n")])

    applyTests.run('append character',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>01234</span></div>']
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp('4'), new Tandem.RetainOp(4,5)])

    applyTests.run('prepend character',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>40123</span></div>']
    , [new Tandem.InsertOp('4'), new Tandem.RetainOp(0,5)])

    applyTests.run('append formatted character',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>0123</span><b>4</b></div>']
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp('4', {bold: true}), new Tandem.RetainOp(4,5)])

    applyTests.run('append newline',
      initial:  ['<div><span>0123</span></div>']
      expected: [0, '<div><br></div>']
    , [new Tandem.RetainOp(0,5), new Tandem.InsertOp("\n")])

    applyTests.run('insert newline in middle of text',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>01</span></div>', '<div><span>23</span></div>']
    , [new Tandem.RetainOp(0,2), new Tandem.InsertOp("\n"), new Tandem.RetainOp(2,5)])

    applyTests.run('insert newline before line with just newline',
      initial:  ['<div><span>01</span></div>', '<div><br></div>', '<div><span>23</span></div>']
      expected: [0, 1, 1, 2]
    , [new Tandem.RetainOp(0,3), new Tandem.InsertOp("\n"), new Tandem.RetainOp(3,7)])

    applyTests.run('insert newline after line with just newline',
      initial:  ['<div><span>01</span></div>', '<div><br></div>', '<div><span>23</span></div>']
      expected: [0, 1, 1, 2]
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp("\n"), new Tandem.RetainOp(4,7)])

    applyTests.run('double insert',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>01ab23</span></div>']
    , [new Tandem.RetainOp(0,2), new Tandem.InsertOp('a'), new Tandem.InsertOp('b'), new Tandem.RetainOp(2,5)])

    applyTests.run('append differing formatted texts',
      initial:  ['<div><br></div>']
      expected: ['<div><b>01</b><i>23</i></div>']
    , [new Tandem.InsertOp('01', {bold:true}), new Tandem.InsertOp('23', {italic:true}), new Tandem.RetainOp(0,1)])

    applyTests.run('append complex delta',
      initial: ['<div><br></div>']
      expected: ['<div><br></div>', '<div><b>Bold</b></div>', '<div><br><div>', '<div><span>Plain</span><div>']
    , [new Tandem.InsertOp('\n'), new Tandem.InsertOp('Bold', {bold:true}), new Tandem.InsertOp('\n\nPlain\n')])
  )


  describe('insertAt', ->
    insertTests = new ScribeEditorTest(
      initial: ['<div><span>Test</span></div>']
      fn: (testEditor, expectedEditor, delta) ->
        testEditor.applyDelta(delta)
    )

    insertTests.run('insert in middle of text',
      expected: ['<div><span>TeAst</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, 'A'))

    insertTests.run('insert formatted text',
      expected: ['<div><span>Te</span><b>A</b><span>st</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, 'A', {bold:true}))

    insertTests.run('insert newline in front of text',
      expected: ['<div><br></div>', '<div><span>Test</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 0, '\n'))

    insertTests.run('append newline',
      expected: ['<div><span>Test</span></div>', '<div><br></div>']
    , Tandem.Delta.makeInsertDelta(5, 5, '\n'))

    insertTests.run('insert newline in middle of text',
      expected: ['<div><span>Te</span></div>', '<div><span>st</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, '\n'))

    insertTests.run('simple multiline insert',
      expected: ['<div><span>TeA</span></div>', '<div><span>Bst</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, 'A\nB'))

    insertTests.run('multiline insert with newline prefix',
      expected: ['<div><span>Te</span></div>', '<div><span>A</span></div>', '<div><span>Bst</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, '\nA\nB'))

    insertTests.run('multiline insert with newline after',
      expected: ['<div><span>TeA</span></div>', '<div><span>B</span></div>', '<div><span>st</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, 'A\nB\n'))

    insertTests.run('multiline insert with newline surrounding',
      expected: ['<div><span>Te</span></div>', '<div><span>A</span></div>', '<div><span>B</span></div>', '<div><span>st</span></div>']
    , Tandem.Delta.makeInsertDelta(5, 2, '\nA\nB\n'))

    insertTests.run('multiline insert with formatted text',
      expected: ['<div><span>Te</span></div>', '<div><b>A</b></div>', '<div><span>B</span></div>', '<div><span>st</span></div>']
    , new Tandem.Delta(5, [new Tandem.RetainOp(0, 2), new Tandem.InsertOp('\n'), new Tandem.InsertOp('A', {bold:true}), new Tandem.InsertOp('\nB\n'), new Tandem.RetainOp(2, 5)]))
  )


  describe('setDelta', ->
    deltaTest = new ScribeEditorTest(
      expected: '<div><span>Test</span></div>'
      fn: (editor) ->
        editor.setDelta(new Tandem.Delta(0, [new Tandem.InsertOp('Test\n')]))
    )
    deltaTest.run('Empty', { initial: '<div><br></div>'} )
    deltaTest.run('Different text', { initial: '<div><span>One</span></div>' })
  )
)


