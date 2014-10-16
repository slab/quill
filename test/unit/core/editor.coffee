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
        initial:  ['<div>0123</div>']
        expected: ['<div>03</div>']
        index: 1, length: 2
      'part of multiple lines':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>']
        expected: ['<div>01<b>78</b></div>']
        index: 2, length: 5
      'entire line keeping trailing newline':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>']
        expected: ['<div><br></div>', '<div><b>5678</b></div>']
        index: 0, length: 4
      'trailing newline':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>']
        expected: ['<div>0123<b>5678</b></div>']
        index: 4, length: 1
      'entire line and parts of neighbors':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>', '<div>abcd</div>']
        expected: ['<div>01cd</div>']
        index: 2, length: 10
      'entire doc':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>']
        expected: ['']
        index: 0, length: 10
      'entire doc except trailing newline':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>']
        expected: ['<div><br></div>']
        index: 0, length: 9
      'last trailing newline':
        initial:  ['<div>0123</div>']
        expected: ['<div>0123</div>']
        index: 4, length: 1
      'bulleted line':
        initial:  ['<div>0</div><ul><li><br></li>']
        expected: ['<div>0</div>']
        index: 2, length: 1

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
        initial:  ['<div>0123</div>']
        expected: new Quill.Delta().insert('0').insert('12', { bold: true }).insert('3\n')
        index: 1, length: 2, name: 'bold', value: true
      'trailing newline with normal format':
        initial:  ['<div>0123</div>']
        expected: new Quill.Delta().insert('0123').insert('\n', { bold: true })
        index: 4, length: 1, name: 'bold', value: true
      'trailing newline with line format':
        initial:  ['<div>0123</div>']
        expected: new Quill.Delta().insert('0123').insert('\n', { align: 'right' })
        index: 4, length: 1, name: 'align', value: 'right'
      'part of multiple lines':
        initial:  ['<div>0123</div>', '<div><b>5678</b></div>']
        expected: new Quill.Delta().insert('01')
                                   .insert('23\n', { strike: true })
                                   .insert('56', { bold: true, strike: true })
                                   .insert('78', { bold: true })
                                   .insert('\n')
        index: 2, length: 5, name: 'strike', value: true
      'line contents with line level format':
        initial:  ['<div>0123</div>']
        expected: new Quill.Delta().insert('0123\n')
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
          expected: '<div>Test</div>'
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
          expected: '<div>A</div><div>B</div>'
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

        expect(@editor.doc.toDelta()).toEqualDelta(new Quill.Delta().insert('A\n', { bold: true }))
      )

      it('multiple formatted newlines', ->
        @editor._insertAt(0, 'A\nB\n', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div><b>A</b></div><div><b>B</b></div>', true)
        expect(@editor.doc.toDelta()).toEqualDelta(new Quill.Delta().insert('A\nB\n', { bold: true }))
      )
    )

    describe('nonempty', ->
      tests =
        'insert in middle of text':
          expected: ['<div>01A23<b><i>4567</i></b></div>']
          index: 2, text: 'A'
        'insert in middle of formatted text':
          expected: ['<div>0123<b><i>45</i></b>A<b><i>67</i></b></div>']
          index: 6, text: 'A'
        'insert formatted text with match':
          expected: ['<div>0123<b><i>45A67</i></b></div>']
          index: 6, text: 'A', formats: { bold: true, italic: true }
        'prepend newline':
          expected: ['<div><br></div>', '<div>0123<b><i>4567</i></b></div>']
          index: 0, text: '\n'
        'append newline':
          expected: ['<div>0123<b><i>4567</i></b></div>', '<div><br></div>']
          index: 8, text: '\n'
        'insert newline in middle':
          expected: ['<div>0123<b><i>45</i></b></div>', '<div><b><i>67</i></b></div>']
          index: 6, text: '\n'
        'insert two newlines in middle':
          expected: ['<div>0123<b><i>45</i></b></div>', '<div><br></div>', '<div><b><i>67</i></b></div>']
          index: 6, text: '\n\n'
        'insert text with newline':
          expected: ['<div>0123<b><i>45</i></b>A</div>', '<div>B<b><i>67</i></b></div>']
          index: 6, text: 'A\nB'
        'multiline insert with preceding newline':
          expected: ['<div>0123<b><i>45</i></b></div>', '<div>A</div>', '<div>B<b><i>67</i></b></div>']
          index: 6, text: '\nA\nB'
        'multiline insert with newline after':
          expected: ['<div>0123<b><i>45</i></b>A</div>', '<div>B</div>', '<div><b><i>67</i></b></div>']
          index: 6, text: 'A\nB\n'
        'multiline insert with newline surrounding':
          expected: ['<div>0123<b><i>45</i></b></div>', '<div>A</div>', '<div>B</div>', '<div><b><i>67</i></b></div>']
          index: 6, text: '\nA\nB\n'

      _.each(tests, (test, name) ->
        it(name, ->
          @editor.doc.setHTML('<div>0123<b><i>4567</i></b></div>')
          @editor._insertAt(test.index, test.text, test.formats)
          @editor.doc.optimizeLines()
          expect(@editor.root).toEqualHTML(test.expected.join(''), true)
        )
      )

      it('append formatted newline', ->
        @editor.doc.setHTML('<div>A</div>')
        @editor._insertAt(2, '\n', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div>A</div><div><br></div>', true)
        expect(@editor.doc.toDelta()).toEqualDelta(new Quill.Delta().insert('A\n').insert('\n', { bold: true }))
      )

      it('insert after image', ->
        @editor.doc.setHTML('<div><img src="http://quilljs.com/images/cloud.png"></div>')
        @editor._insertAt(1, 'A', { bold: true })
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div><img src="http://quilljs.com/images/cloud.png"><b>A</b></div>', true)
      )

      it('insert newline after bullet', ->
        @editor.doc.setHTML('<ul><li>One</li></ul>')
        @editor._insertAt(1, '\n')
        @editor.doc.optimizeLines()
        expect(@editor.root).toEqualHTML('<div>O</div><ul><li>ne</li></ul>', true)
      )
    )
  )

  describe('applyDelta()', ->
    tests =
      'insert formatted':
        initial: '<div>0123</div>'
        delta: new Quill.Delta().retain(2).insert('|', { bold: true })
        expected: '<div>01<b>|</b>23</div>'
      'multiple formats':
        initial: '<div>0123</div>'
        delta: new Quill.Delta().retain(1).retain(2, { bold: true, italic: true })
        expected: '<div>0<b><i>12</i></b>3</div>'
      'multiple instructions':
        initial: '
          <div>0123</div>
          <div>5678</div>
          <div>abcd</div>'
        delta: new Quill.Delta().retain(4).delete(1).retain(2).insert('|\n|').retain(7).retain(1, { align: 'right' })
        expected: '
          <div>012356|</div>
          <div>|78</div>
          <div style="text-align: right;">abcd</div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @editor.doc.setHTML(test.initial)
        @editor.checkUpdate()
        @editor.applyDelta(test.delta)
        expect(@editor.root).toEqualHTML(test.expected, true)
      )
    )

    it('local change', ->
      @editor.doc.setHTML('<div>0123</div>')
      @editor.checkUpdate()
      delta = new Quill.Delta().retain(4).insert('|')
      @editor.root.querySelector('div').innerHTML = '01a23'
      @editor.applyDelta(delta)
      expected = '<div>01a23|</div>'
      expect(@editor.root).toEqualHTML(expected, true)
    )
  )
)
