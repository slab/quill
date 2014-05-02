describe('Editor', ->
  beforeEach( ->
    @container = $('#editor-container').html('<div></div>').get(0)
    Quill.Lib.EventEmitter2.events = Quill.events
    emitter = new Quill.Lib.EventEmitter2
    @editor = new Quill.Editor(@container.firstChild, emitter, { formats: Quill.DEFAULTS.formats })
  )

  describe('_deleteAt()', ->
    tests =
      'part of line':
        initial:  ['<div><span>0123</span></div>']
        expected: ['<div><span>03</span></div>']
        index: 1, length: 2
      'part of multiple lines':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>']
        expected: ['<div><span>01</span><b>78</b></div>']
        index: 2, length: 5
      'entire line keeping trailing newline':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>']
        expected: ['<div><br></div>', '<div><b>5678</b></div>']
        index: 0, length: 4
      'trailing newline':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>']
        expected: ['<div><span>0123</span><b>5678</b></div>']
        index: 4, length: 1
      'entire line and parts of neighbors':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>', '<div><span>abcd</span></div>']
        expected: ['<div><span>01cd</span></div>']
        index: 2, length: 10
      'entire doc':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>']
        expected: ['']
        index: 0, length: 10
      'entire doc except trailing newline':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>']
        expected: ['<div><br></div>']
        index: 0, length: 9
      'last trailing newline':
        initial:  ['<div><span>0123</span></div>']
        expected: ['<div><span>0123</span></div>']
        index: 4, length: 1

    _.each(tests, (test, name) ->
      it(name, ->
        @editor.doc.setHTML(test.initial.join(''))
        @editor._deleteAt(test.index, test.length)
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML(test.expected.join(''), true)
      )
    )
  )

  describe('_formatAt()', ->
    tests =
      'part of line':
        initial:  ['<div><span>0123</span></div>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
          { value: '0' }
          { value: '12', attributes: { bold: true } }
          { value: '3\n' }
        ]})
        index: 1, length: 2, name: 'bold', value: true
      'trailing newline with normal format':
        initial:  ['<div><span>0123</span></div>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
          { value: '0123' }
          { value: '\n', attributes: { bold: true } }
        ]})
        index: 4, length: 1, name: 'bold', value: true
      'trailing newline with line format':
        initial:  ['<div><span>0123</span></div>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
          { value: '0123' }
          { value: '\n', attributes: { align: 'right' } }
        ]})
        index: 4, length: 1, name: 'align', value: 'right'
      'part of multiple lines':
        initial:  ['<div><span>0123</span></div>', '<div><b>5678</b></div>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 10, ops: [
          { value: '01' }
          { value: '23\n', attributes: { strike: true } }
          { value: '56', attributes: { bold: true, strike: true } }
          { value: '78', attributes: { bold: true } }
          { value: '\n' }
        ]})
        index: 2, length: 5, name: 'strike', value: true
      'line contents with line level format':
        initial:  ['<div><span>0123</span></div>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
          { value: '0123\n' }
        ]})
        index: 1, length: 2, name: 'align', value: 'right'

    _.each(tests, (test, name) ->
      it(name, ->
        @editor.doc.setHTML(test.initial.join(''))
        @editor._formatAt(test.index, test.length, test.name, test.value)
        @editor.doc.optimizeLines()
        expect(@editor.doc.toDelta()).toEqualDelta(test.expected)
      )
    )
  )

  describe('_insertAt()', ->
    describe('empty', ->
      tests =
        'text':
          expected: '<div><span>Test</span></div>'
          text: 'Test'
        'formatted text':
          expected: '<div><i><b>Test</b></i></div>'
          text: 'Test', formats: { bold: true, italic: true }
        'newline':
          expected: '<div><br></div>'
          text: '\n'
        'multiple newlines':
          expected: '<div><br></div><div><br></div>'
          text: '\n\n'
        'multiline insert':
          expected: '<div><span>A</span></div><div><span>B</span></div>'
          text: 'A\nB\n'

      _.each(tests, (test, name) ->
        it(name, ->
          @editor._insertAt(0, test.text, test.formats)
          @editor.doc.optimizeLines()
          expect(@editor.root).toEqualHTML(test.expected, true)
        )
      )

      it('formatted newline', ->
        @editor._insertAt(0, 'A\n', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div><b>A</b></div>', true)
        expect(@editor.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, 'A\n', { bold: true }))
      )

      it('multiple formatted newlines', ->
        @editor._insertAt(0, 'A\nB\n', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div><b>A</b></div><div><b>B</b></div>', true)
        expect(@editor.doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, 'A\nB\n', { bold: true }))
      )
    )

    describe('nonempty', ->
      tests =
        'insert in middle of text':
          expected: ['<div><span>01A23</span><b><i>4567</i></b></div>']
          index: 2, text: 'A'
        'insert in middle of formatted text':
          expected: ['<div><span>0123</span><b><i>45</i></b><span>A</span><b><i>67</i></b></div>']
          index: 6, text: 'A'
        'insert formatted text with match':
          expected: ['<div><span>0123</span><b><i>45A67</i></b></div>']
          index: 6, text: 'A', formats: { bold: true, italic: true }
        'prepend newline':
          expected: ['<div><br></div>', '<div><span>0123</span><b><i>4567</i></b></div>']
          index: 0, text: '\n'
        'append newline':
          expected: ['<div><span>0123</span><b><i>4567</i></b></div>', '<div><br></div>']
          index: 8, text: '\n'
        'insert newline in middle':
          expected: ['<div><span>0123</span><b><i>45</i></b></div>', '<div><b><i>67</i></b></div>']
          index: 6, text: '\n'
        'insert text with newline':
          expected: ['<div><span>0123</span><b><i>45</i></b><span>A</span></div>', '<div><span>B</span><b><i>67</i></b></div>']
          index: 6, text: 'A\nB'
        'multiline insert with preceding newline':
          expected: ['<div><span>0123</span><b><i>45</i></b></div>', '<div><span>A</span></div>', '<div><span>B</span><b><i>67</i></b></div>']
          index: 6, text: '\nA\nB'
        'multiline insert with newline after':
          expected: ['<div><span>0123</span><b><i>45</i></b><span>A</span></div>', '<div><span>B</span></div>', '<div><b><i>67</i></b></div>']
          index: 6, text: 'A\nB\n'
        'multiline insert with newline surrounding':
          expected: ['<div><span>0123</span><b><i>45</i></b></div>', '<div><span>A</span></div>', '<div><span>B</span></div>', '<div><b><i>67</i></b></div>']
          index: 6, text: '\nA\nB\n'

      _.each(tests, (test, name) ->
        it(name, ->
          @editor.doc.setHTML('<div><span>0123</span><b><i>4567</i></b></div>')
          @editor._insertAt(test.index, test.text, test.formats)
          @editor.doc.optimizeLines()
          expect(@editor.root).toEqualHTML(test.expected.join(''), true)
        )
      )

      it('append formatted newline', ->
        @editor.doc.setHTML('<div><span>A</span></div>')
        @editor._insertAt(2, '\n', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div><span>A</span></div><div><br></div>', true)
        expect(@editor.doc.toDelta()).toEqualDelta(Tandem.Delta.makeDelta({
          startLength: 0
          endLength: 3
          ops: [
            { value: 'A\n' }
            { value: '\n', attributes: { bold: true } }
          ]
        }))
      )

      it('insert after image', ->
        @editor.doc.setHTML('<div><img src="http://quilljs.com/images/cloud.png"></div>')
        @editor._insertAt(1, 'A', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div><img src="http://quilljs.com/images/cloud.png"><b>A</b></div>', true)
      )
    )
  )

  describe('applyDelta()', ->
    tests =
      'insert formatted':
        initial: '<div><span>0123</span></div>'
        delta: Tandem.Delta.makeInsertDelta(5, 2, '|', { bold: true })
        expected: '<div><span>01</span><b>|</b><span>23</span></div>'
      'multiple formats':
        initial: '<div><span>0123</span></div>'
        delta: Tandem.Delta.makeRetainDelta(5, 1, 2, { bold: true, italic: true })
        expected: '<div><span>0</span><b><i>12</i></b><span>3</span></div>'
      'multiple instructions':
        initial: '
          <div><span>0123</span></div>
          <div><span>5678</span></div>
          <div><span>abcd</span></div>'
        delta: Tandem.Delta.makeDelta({ startLength: 15, endLength: 17, ops: [
          { start: 0, end: 4 }
          { start: 5, end: 7 }
          { value: '|\n|' }
          { start: 7, end: 14 }
          { start: 14, end: 15, attributes: { align: 'right' } }
        ]})
        expected: '
          <div><span>012356|</span></div>
          <div><span>|78</span></div>
          <div style="text-align: right;"><span>abcd</span></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @editor.doc.setHTML(test.initial)
        @editor.checkUpdate()
        @editor.applyDelta(test.delta)
        expect(@editor.root).toEqualHTML(test.expected, true)
      )
    )

    it('local change', ->
      @editor.doc.setHTML('<div><span>0123</span></div>')
      @editor.checkUpdate()
      delta = Tandem.Delta.makeInsertDelta(5, 2, '|')
      @editor.root.querySelector('span').innerHTML = '01a23'
      @editor.applyDelta(delta)
      expected = '<div><span>01|a23</span></div>'
      expect(@editor.root).toEqualHTML(expected, true)
    )
  )
)
