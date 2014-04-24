describe('Editor', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )
  # applyDelta()
    # Test local delta transformation
  # checkUpdate()
  # update()
  # _trackDelta()
    # Turn off checkInterval, change shit via DOM API
  # _update()

  describe('manipulation', ->
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
          @container.innerHTML = test.initial.join('')
          @quill = new Quill(@container)
          @quill.editor._deleteAt(test.index, test.length)
          @quill.editor.doc.optimizeLines()
          expect.equalHTML(@quill.editor.root, test.expected.join(''), true)
        )
      )
    )

    describe('_formatAt()', ->
      tests =
        'part of line':
          initial:  ['<div><span>0123</span></div>']
          expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
            { value: '0'}
            { value: '12', attributes: { bold: true } }
            { value: '3\n'}
          ]})
          index: 1, length: 2, name: 'bold', value: true
        'trailing newline with normal format':
          initial:  ['<div><span>0123</span></div>']
          expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
            { value: '0123'}
            { value: '\n', attributes: { bold: true } }
          ]})
          index: 4, length: 1, name: 'bold', value: true
        'trailing newline with line format':
          initial:  ['<div><span>0123</span></div>']
          expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
            { value: '0123'}
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
            { value: '0123\n'}
          ]})
          index: 1, length: 2, name: 'align', value: 'right'

      _.each(tests, (test, name) ->
        it(name, ->
          @container.innerHTML = test.initial.join('')
          quill = new Quill(@container)
          quill.editor._formatAt(test.index, test.length, test.name, test.value)
          quill.editor.doc.optimizeLines()
          expect(quill.editor.doc.toDelta()).toEqualDelta(test.expected)
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

        _.each(tests, (test, name) ->
          it(name, ->
            @quill = new Quill(@container)
            @quill.editor._insertAt(0, test.text, test.formats)
            @quill.editor.doc.optimizeLines()
            expect.equalHTML(@quill.editor.root, test.expected, true)
          )
        )
      )

      describe('nonempty', ->
        beforeEach( ->
          @container.innerHTML = '<div><span>0123</span><b><i>4567</i></b></div>'
          @quill = new Quill(@container)
        )

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
            @quill.editor._insertAt(test.index, test.text, test.formats)
            @quill.editor.doc.optimizeLines()
            expect.equalHTML(@quill.editor.root, test.expected.join(''), true)
          )
        )
      )
    )
  )
)
