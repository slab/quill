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
      'with blocks':
        initial: '<div><span>A</span><br><span>B</span><br><span>C</span></div>'
        expected: '<div><span>A</span><br></div><div><span>B</span><br></div><div><span>C</span></div>'
      'pull and break':
        initial: '<div><div><div><span>A</span></div><span>B</span><br><span>C</span></div></div>'
        expected: '<div><span>A</span></div><div><span>B</span><br></div><div><span>C</span></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        expect.equalHTML(@container.firstChild, test.expected, true)
      )
    )
  )

  describe('search', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div><span>0123</span></div>
          <div><br></div>
          <div><b>6789</b></div>
        </div>
      '
      @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
    )

    it('findLine() lineNode', ->
      line = @doc.findLine(@doc.root.firstChild)
      expect(line).to.equal(@doc.lines.first)
    )

    it('findLine() not a line', ->
      node = @doc.root.ownerDocument.createElement('i')
      node.innerHTML = '<span>Test</span>'
      @doc.root.appendChild(node)
      line = @doc.findLine(node)
      expect(line).to.be(null)
    )

    it('findLine() not in doc', ->
      line = @doc.findLine($('#expected-container').get(0))
      expect(line).to.be(null)
    )

    it('findLine() id false positive', ->
      clone = @doc.root.firstChild.cloneNode(true)
      @doc.root.appendChild(clone)
      line = @doc.findLine(clone)
      expect(line).to.be(null)
    )

    it('findLine() leaf node', ->
      line = @doc.findLine(@doc.root.querySelector('b'))
      expect(line).to.equal(@doc.lines.last)
    )

    it('findLineAt() middle of line', ->
      [line, offset] = @doc.findLineAt(2)
      expect(line).to.equal(@doc.lines.first)
      expect(offset).to.equal(2)
    )

    it('findLineAt() last line', ->
      [line, offset] = @doc.findLineAt(8)
      expect(line).to.equal(@doc.lines.last)
      expect(offset).to.equal(2)
    )

    it('findLineAt() end of line', ->
      [line, offset] = @doc.findLineAt(5)
      expect(line).to.equal(@doc.lines.first)
      expect(offset).to.equal(5)
    )

    it('findLineAt() newline', ->
      [line, offset] = @doc.findLineAt(6)
      expect(line).to.equal(@doc.lines.first.next)
      expect(offset).to.equal(1)
    )

    it('findLineAt() end of document', ->
      [line, offset] = @doc.findLineAt(10)
      expect(line).to.be(@doc.lines.last)
      expect(offset).to.equal(0)
    )

    it('findLineAt() beyond document', ->
      [line, offset] = @doc.findLineAt(11)
      expect(line).to.be(null)
      expect(offset).to.equal(1)
    )
  )

  describe('manipulation', ->
    beforeEach( ->
      @container.innerHTML = Quill.Normalizer.stripWhitespace('
        <div>
          <div><span>Test</span></div>
          <div><i>Test</i></div>
          <div><br></div>
          <div><br></div>
          <div><b>Test</b></div>
        </div>
      ')
      @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
      @lines = @doc.lines.toArray()
    )

    it('mergeLines() normal', ->
      @doc.mergeLines(@lines[0], @lines[1])
      expect.equalHTML(@doc.root, '
        <div><span>Test</span><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length - 1)
    )

    it('mergeLines() with newline', ->
      @doc.mergeLines(@lines[1], @lines[2])
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length - 1)
    )

    it('mergeLines() from newline', ->
      @doc.mergeLines(@lines[3], @lines[4])
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length - 1)
    )

    it('mergeLines() two newlines', ->
      @doc.mergeLines(@lines[2], @lines[3])
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length - 1)
    )

    it('removeLine() existing', ->
      @doc.removeLine(@lines[1])
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length - 1)
    )

    it('removeLine() lineNode missing', ->
      Quill.DOM.removeNode(@lines[1].node)
      @doc.removeLine(@lines[1])
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length - 1)
    )

    it('splitLine() middle', ->
      @doc.splitLine(@lines[1], 2)
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><i>Te</i></div>
        <div><i>st</i></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length + 1)
    )

    it('splitLine() beginning', ->
      @doc.splitLine(@lines[1], 0)
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><br></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length + 1)
    )

    it('splitLine() end', ->
      @doc.splitLine(@lines[1], 4)
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length + 1)
    )

    it('splitLine() split break', ->
      @doc.splitLine(@lines[2], 0)
      expect.equalHTML(@doc.root, '
        <div><span>Test</span></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).to.equal(@lines.length + 1)
    )

    it('setHTML() valid', ->
      html = '<div><span>Test</span></div>'
      @doc.setHTML(html)
      expect.equalHTML(@doc.root, html, true)
    )

    it('setHTML() invalid', ->
      @doc.setHTML('
        <div>
          <div>
            <div>
              <span>A</span>
            </div>
            <span>B</span>
            <br>
            <span>C</span>
          </div>
        </div>
        <div>
          <b></b>
        </div>
      ')
      expect.equalHTML(@doc.root, '
        <div>
          <span>A</span>
        </div>
        <div>
          <span>B</span><br>
        </div>
        <div>
          <span>C</span>
        </div>
        <div>
          <b><br></b>
        </div>
      ', true)
    )
  )

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
