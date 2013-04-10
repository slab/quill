describe('Document', ->
  describe('findLineAtOffset', ->
    it('should find correct offset in line', ->
      lines = ['<div><br></div>', '<div><span>12</span></div>', '<div><b>45</b></div>', '<div><br></div>', '<div><br></div>', '<ul><li><span>78</span></li></ul>', '<ul><li><br></li></ul>']
      $('#test-container').html(lines.join(''))
      editor = new Scribe.Editor('test-container')
      lines = editor.doc.lines.toArray()
      _.each([[0], [1,2,3], [4,5,6], [7], [8], [9,10,11], [12]], (indexGroup, lineIndex) ->
        _.each(indexGroup, (index, indexIndex) ->
          [line, offset] = editor.doc.findLineAtOffset(index)
          expect([line.id, offset]).to.deep.equal([lines[lineIndex].id, indexIndex])
        )
      )
    )
  )

  describe('toDelta', ->
    deltaTest = new Scribe.Test.EditorTest()
    deltaTest.run('basic',
      initial:  ['<div><span>0123</span></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("0123\n")])
    )
    deltaTest.run('format',
      initial:  ['<div><b>0123</b></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp('0123', {bold:true}), new Tandem.InsertOp("\n")])
    )
    deltaTest.run('empty string',
      initial:  ['']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("\n")])
    )
    deltaTest.run('empty break',
      initial:  ['<div><br></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("\n")])
    )
    deltaTest.run('two newlines',
      initial:  ['<div><br></div>', '<div><br></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("\n\n")])
    )
    deltaTest.run('text and newline',
      initial:  ['<div><span>0</span></div>', '<div><br></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("0\n\n")])
    )
    deltaTest.run('newline and text',
      initial:  ['<div><br></div>', '<div><span>0</span></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("\n0\n")])
    )
  )
)
