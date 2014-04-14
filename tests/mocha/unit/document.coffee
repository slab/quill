Tandem = require('tandem-core')


describe('Document', ->
  describe('findLineAt', ->
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
      doc = new Quill.Document($('#test-container').get(0))
      lines = doc.lines.toArray()
      _.each([[0], [1,2,3], [4,5,6], [7], [8], [9,10,11], [12]], (indexGroup, lineIndex) ->
        _.each(indexGroup, (index, indexIndex) ->
          [line, offset] = doc.findLineAt(index)
          expect(line.node.innerHTML).to.be.equal(lines[lineIndex].node.innerHTML)
          expect(line.id).to.be.equal(lines[lineIndex].id)
          expect(offset).to.be.equal(indexIndex)
        )
      )
    )
  )

  describe('findLine', -> )
  describe('findLineAt', -> )
  describe('mergeLines', -> )
  describe('removeLine', -> )
  describe('splitLine', -> )
  describe('setHTML', -> )


  describe('toDelta', ->
    tests =
      'blank':
        initial:  ['']
        expected: Tandem.Delta.getInitial('')
      'empty':
        initial:  ['<div><span></span></div>']
        expected: Tandem.Delta.getInitial('')
      'single line':
        initial:  ['<div><span>0123</span></div>']
        expected: Tandem.Delta.getInitial('0123')
      'single newline':
        initial:  ['<div><br></div>']
        expected: Tandem.Delta.getInitial('\n')
      'preceding newline':
        initial:  ['<div><br></div>', '<div><span>0</span></div>']
        expected: Tandem.Delta.getInitial('\n0')
      'trailing newline':
        initial:  ['<div><span>0</span></div>', '<div><br></div>']
        expected: Tandem.Delta.getInitial('0\n')
      'multiple lines':
        initial:  ['<div><span>0</span></div>', '<div><span>1</span></div>']
        expected: Tandem.Delta.getInitial('0\n1')
      'multiple newlines':
        initial:  ['<div><br></div>', '<div><br></div>']
        expected: Tandem.Delta.getInitial('\n\n')
      'multiple preceding newlines':
        initial:  ['<div><br></div>', '<div><br></div>', '<div><span>0</span></div>']
        expected: Tandem.Delta.getInitial('\n\n0')
      'multiple trailing newlines':
        initial:  ['<div><span>0</span></div>', '<div><br></div>', '<div><br></div>']
        expected: Tandem.Delta.getInitial('0\n\n')
      'lines separated by multiple newlines':
        initial:  ['<div><span>0</span></div>', '<div><br></div>', '<div><span>1</span></div>']
        expected: Tandem.Delta.getInitial('0\n\n1')
      'tag format':
        initial:  ['<div><b>0123</b></div>']
        expected: Tandem.Delta.makeInsertDelta(0, 0, '0123', { bold: true })
      'style format':
        initial:  ['<div><span style="color: teal;">0123</span></div>']
        expected: Tandem.Delta.makeInsertDelta(0, 0, '0123', { 'color': 'teal' })

    _.each(tests, (test, name) ->
      it(name, ->
        $container = $('#test-container').html(test.initial.join(''))
        doc = new Quill.Document($container.get(0), { formats: Quill.DEFAULTS.formats })
        expect.equalDeltas(doc.toDelta(), test.expected)
      )
    )
  )
)
