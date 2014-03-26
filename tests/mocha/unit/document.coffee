expect = require('expect.js')
Tandem = require('tandem-core')
ScribeEditorTest = require('../lib/editor-test')


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

  # TODO add more cases, esp with double newlines
  describe('toDelta', ->
    deltaTest = new ScribeEditorTest()
    deltaTest.run('basic',
      initial:  ['<div><span>0123</span></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("0123")])
    )
    deltaTest.run('blank',
      initial:  ['']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("")])
    )
    deltaTest.run('empty div',
      initial:  ['<div></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("\n")])
    )
    deltaTest.run('empty span',
      initial:  ['<div><span></span></div>']
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
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("0\n")])
    )
    deltaTest.run('newline and text',
      initial:  ['<div><br></div>', '<div><span>0</span></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("\n0")])
    )
    deltaTest.run('text, newline, text',
      initial:  ['<div><span>0</span></div>', '<div><span>1</span></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp("0\n1")])
    )
    deltaTest.run('format',
      initial:  ['<div><b>0123</b></div>']
      expected: new Tandem.Delta(0, [new Tandem.InsertOp('0123', {bold:true})])
    )
  )
)
