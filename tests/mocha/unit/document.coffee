Tandem = require('tandem-core')

describe('Document', ->
  beforeEach( ->
    @container = $('#test-container').html('').get(0)
  )

  describe('constructor', ->
    tests =
      'blank':
        initial: ''
        expected: ''
      'no change':
        initial: '<div><span>Test</span></div>'
        expected: '<div><span>Test</span></div>'
      'text':
        initial: 'Test'
        expected: '<div><span>Test</span></div>'
      'inline':
        initial: '<span>Test</span>'
        expected: '<div><span>Test</span></div>'
      'block pulling':
        initial: '<div><div><div><div><span>Test</span><div>Test</div></div></div></div></div>'
        expected: '<div><span>Test</span></div><div><span>Test</span></div>'
      'break blocks':
        initial: '<div><span>A</span><br><span>B</span><br><span>C</span></div>'
        expected: '<div><span>A</span></div><div><span>B</span></div><div><span>C</span></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        expect.equalHTML(@container.firstChild, test.expected, true)
      )
    )
  )

  describe('findLine()', -> )
  describe('findLineAt()', -> )

  describe('mergeLines()', -> )
  describe('removeLine()', -> )
  describe('splitLine()', -> )

  describe('toDelta()', ->
    tests =
      'blank':
        initial:  ['']
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
        @container.innerHTML = test.initial.join('')
        doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
        expect.equalDeltas(doc.toDelta(), test.expected)
      )
    )
  )
)
