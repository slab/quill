describe('Editor', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )
  # applyDelta()
    # Test local delta transformation
  # checkUpdate()
  # update()
  # _deleteAt()
  # _insertAt()
  # _formatAt()
  # _trackDelta()
    # Turn off checkInterval, change shit via DOM API
  # _update()

  describe('manipulation', ->
    describe('_deleteAt()', -> )

    describe('_formatAt()', ->)

    describe('_insertAt()', ->
      describe('empty', ->
        beforeEach( ->
          @quill = new Quill(@container)
          @editor = @quill.editor
        )

        tests =
          'text':
            expected: '<div><span>Test</i></span>'
            text: 'Test'
          'formatted text':
            expected: '<div><b><i>Test</i></b></div>'
            text: 'Test', formats: { bold: true, italic: true }
          'newline':
            expected: '<div><br></div>'
            text: '\n'
          'multiple newlines':
            expected: '<div><br></div><div><br></div>'
            text: '\n\n'

        _.each(tests, (test, name) ->
          it(name, ->
            @editor._insertAt(0, test.text, test.formats)
            @editor.doc.optimizeLines()
            expect.equalHTML(@editor.root, test.expected, true)
          )
        )
      )

      describe('nonempty', ->
        beforeEach( ->
          @container.innerHTML = '<div><span>0123</span><b><i>4567</i></b></div>'
          @quill = new Quill(@container)
          @editor = @quill.editor
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
            @editor._insertAt(test.index, test.text, test.formats)
            @editor.doc.optimizeLines()
            expect.equalHTML(@editor.root, test.expected.join(''), true)
          )
        )
      )
    )
  )
)
