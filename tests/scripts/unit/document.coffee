describe('Document', ->
  describe('findLineAtOffset', ->
    it('should find correct offset in line', ->
      lines = ['<div><br></div>', '<div><span>12</span></div>', '<div><b>45</b></div>', '<div><br></div>', '<div><br></div>', '<ul><li><span>78</span></li></ul>', '<ul><li><br></li></ul>']
      $('#editor-container').html(lines.join(''))
      editor = new Scribe.Editor('editor-container')
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
    tests = 
      'basic':
        lines: ['<div><span>0123</span></div>']
        deltas: [new Tandem.InsertOp("0123\n")]
      'format':
        lines: ['<div><b>0123</b></div>']
        deltas: [new Tandem.InsertOp('0123', {bold:true}), new Tandem.InsertOp("\n")]
      'empty':
        lines: ['']
        deltas: [new Tandem.InsertOp("\n")]
      'empty 2':
        lines: ['<div><br></div>']
        deltas: [new Tandem.InsertOp("\n")]
      'newline':
        lines: ['<div><br></div>', '<div><br></div>']
        deltas: [new Tandem.InsertOp("\n\n")]
      'text + newline':
        lines: ['<div><span>0</span></div>', '<div><br></div>']
        deltas: [new Tandem.InsertOp("0\n\n")]
      'newline + text':
        lines: ['<div><br></div>', '<div><span>0</span></div>']
        deltas: [new Tandem.InsertOp("\n0\n")]

    _.each(tests, (test, name) ->
      it(name, ->
        html = test.lines.join('')
        $('#editor-container').html(html)
        endLength = _.reduce(test.deltas, ((count, delta) -> return count + delta.getLength()), 0)
        delta = new Tandem.Delta(0, endLength, test.deltas)
        editor = new Scribe.Editor('editor-container')
        editorDelta = editor.doc.toDelta()
        expect(editorDelta).to.deep.equal(delta)
      )
    )
  )
)
