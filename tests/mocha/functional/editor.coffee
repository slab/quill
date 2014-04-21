Tandem = require('tandem-core')
QuillEditorTest = require('../lib/editor-test')


describe('Editor', ->
  describe('updateContents', ->
    applyTests = new QuillEditorTest(
      fn: (testEditor, expectedEditor, ops) ->
        delta = new Tandem.Delta(testEditor.getLength(), ops)
        testEditor.updateContents(delta)
    )

    applyTests.run('apply to empty',
      initial:  []
      expected: ['<div><span>0123</span></div>']
    , [new Tandem.InsertOp("0123")])

    applyTests.run('append character',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>01234</span></div>']
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp('4')])

    applyTests.run('prepend character',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>40123</span></div>']
    , [new Tandem.InsertOp('4'), new Tandem.RetainOp(0,4)])

    applyTests.run('append formatted character',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>0123</span><b>4</b></div>']
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp('4', {bold: true})])

    applyTests.run('append newline',
      initial:  ['<div><span>0123</span></div>']
      expected: [0, '<div><br></div>']
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp("\n")])

    applyTests.run('insert newline in middle of text',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>01</span></div>', '<div><span>23</span></div>']
    , [new Tandem.RetainOp(0,2), new Tandem.InsertOp("\n"), new Tandem.RetainOp(2,4)])

    applyTests.run('insert newline before line with just newline',
      initial:  ['<div><span>01</span></div>', '<div><br></div>', '<div><span>23</span></div>']
      expected: [0, 1, 1, 2]
    , [new Tandem.RetainOp(0,3), new Tandem.InsertOp("\n"), new Tandem.RetainOp(3,6)])

    applyTests.run('insert newline after line with just newline',
      initial:  ['<div><span>01</span></div>', '<div><br></div>', '<div><span>23</span></div>']
      expected: [0, 1, 1, 2]
    , [new Tandem.RetainOp(0,4), new Tandem.InsertOp("\n"), new Tandem.RetainOp(4,6)])

    applyTests.run('double insert',
      initial:  ['<div><span>0123</span></div>']
      expected: ['<div><span>01ab23</span></div>']
    , [new Tandem.RetainOp(0,2), new Tandem.InsertOp('a'), new Tandem.InsertOp('b'), new Tandem.RetainOp(2,4)])

    applyTests.run('append differing formatted texts',
      initial:  ['<div><br></div>']
      expected: ['<div><br></div>','<div><b>01</b><i>23</i></div>']
    , [new Tandem.RetainOp(0,1), new Tandem.InsertOp('01', {bold:true}), new Tandem.InsertOp('23', {italic:true})])

    applyTests.run('append complex delta',
      initial: ['<div><br></div>']
      expected: ['<div><br></div>', '<div><b>Bold</b></div>', '<div><br><div>', '<div><span>Plain</span><div>']
    , [new Tandem.RetainOp(0,1), new Tandem.InsertOp('Bold', {bold:true}), new Tandem.InsertOp('\n\nPlain')])
  )


  describe('insertText', ->
    insertTests = new QuillEditorTest(
      initial: ['<div><span>Test</span></div>']
      fn: (testEditor, expectedEditor, delta) ->
        testEditor.updateContents(delta)
    )

    insertTests.run('multiline insert with formatted text',
      expected: ['<div><span>Te</span></div>', '<div><b>A</b></div>', '<div><span>B</span></div>', '<div><span>st</span></div>']
    , new Tandem.Delta(4, [new Tandem.RetainOp(0, 2), new Tandem.InsertOp('\n'), new Tandem.InsertOp('A', {bold:true}), new Tandem.InsertOp('\nB\n'), new Tandem.RetainOp(2, 4)]))
  )


  describe('setContents', ->
    deltaTest = new QuillEditorTest(
      expected: '<div><span>Test</span></div>'
      fn: (editor) ->
        editor.setContents(new Tandem.Delta(0, [new Tandem.InsertOp('Test')]))
    )
    deltaTest.run('Empty', { initial: '<div><br></div>'} )
    deltaTest.run('Different text', { initial: '<div><span>One</span></div>' })
  )
)


