Tandem = require('tandem-core')


describe('Document', ->
  describe('findLineAtOffset', ->
    it('should find correct offset in line', ->
      lines = [
        '<div><br></div>'
        '<div><span>12</span></div>'
        '<div><b>45</b></div>'
        '<div><br></div>'
        '<div><br></div>'
        '<div><span>78</span></div>'
        '<div><br></div>'
      ]
      $('#test-container').html(lines.join(''))
      doc = new Scribe.Document($('#test-container').get(0))
      lines = doc.lines.toArray()
      _.each([[0], [1,2,3], [4,5,6], [7], [8], [9,10,11], [12]], (indexGroup, lineIndex) ->
        _.each(indexGroup, (index, indexIndex) ->
          [line, offset] = doc.findLineAtOffset(index)
          expect(line.node.innerHTML).to.be.equal(lines[lineIndex].node.innerHTML)
          expect(line.id).to.be.equal(lines[lineIndex].id)
          expect(offset).to.be.equal(indexIndex)
        )
      )
    )
  )

  describe('toDelta', ->
    tests =
      'basic':
        initial:  ['<div><span>0123</span></div>']
        expected: Tandem.Delta.getInitial('0123')
      'blank':
        initial:  ['<div><span></span></div>']
        expected: Tandem.Delta.getInitial('')
      'empty break':
        initial:  ['<div><br></div>']
        expected: Tandem.Delta.getInitial('\n')
      'trailing newline':
        initial:  ['<div><span>0</span></div>', '<div><br></div>']
        expected: Tandem.Delta.getInitial('0\n')
      'preceding newline':
        initial:  ['<div><br></div>', '<div><span>0</span></div>']
        expected: Tandem.Delta.getInitial('\n0')
      'multiline':
        initial:  ['<div><span>0</span></div>', '<div><span>1</span></div>']
        expected: Tandem.Delta.getInitial('0\n1')
      'double newline':
        initial:  ['<div><br></div>', '<div><br></div>']
        expected: Tandem.Delta.getInitial('\n\n')
      'double preceding newline':
        initial:  ['<div><br></div>', '<div><br></div>', '<div><span>0</span></div>']
        expected: Tandem.Delta.getInitial('\n\n0')
      'double trailing newline':
        initial:  ['<div><span>0</span></span>', '<div><br></div>', '<div><br></div>']
        expected: Tandem.Delta.getInitial('0\n\n')
      'multiline with double newline':
        initial:  ['<div><span>0</span></div>', '<div><br></div>', '<div><span>1</span></div>']
        expected: Tandem.Delta.getInitial('0\n\n1')
      'format':
        initial:  ['<div><b>0123</b></div>']
        expected: Tandem.Delta.makeInsertDelta(0, 0, '0123', { bold:true })

    _.each(tests, (test, name) ->
      it(name, ->
        $container = $('#test-container').html(test.initial.join(''))
        doc = new Scribe.Document($container.get(0))
        delta = doc.toDelta()
        if !delta.isEqual(test.expected)
          console.error(doc, delta, test.expected)
          throw new Error('Unequal deltas')
      )
    )
  )
)
