describe('Document', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )

  describe('constructor', ->
    tests =
      'blank':
        initial:  ''
        expected: ''
      'no change':
        initial:  '<p><span>Test</span></p>'
        expected: '<p><span>Test</span></p>'
      'text':
        initial:  'Test'
        expected: '<p><span>Test</span></p>'
      'inline':
        initial:  '<span>Test</span>'
        expected: '<p><span>Test</span></p>'
      'block pulling':
        initial:  '<div><div><div><div><span>Test</span><div>Test</div></div></div></div></div>'
        expected: '<p><span>Test</span></p><p><span>Test</span></p>'
      'with blocks':
        initial:  '<p><span>A</span><br><span>B</span><br><span>C</span></p>'
        expected: '<p><span>A</span><br></p><p><span>B</span><br></p><p><span>C</span></p>'
      'pull and break':
        initial:  '<div><div><div><span>A</span></div><span>B</span><br><span>C</span></div></div>'
        expected: '<p><span>A</span></p><p><span>B</span><br></p><p><span>C</span></p>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        expect(@container.firstChild).toEqualHTML(test.expected, true)
      )
    )
  )

  describe('search', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <p><span>0123</span></p>
          <p><br></p>
          <p><b>6789</b></p>
        </div>
      '
      @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
    )

    it('findLine() lineNode', ->
      line = @doc.findLine(@doc.root.firstChild)
      expect(line).toEqual(@doc.lines.first)
    )

    it('findLine() not a line', ->
      node = @doc.root.ownerDocument.createElement('i')
      node.innerHTML = '<span>Test</span>'
      @doc.root.appendChild(node)
      line = @doc.findLine(node)
      expect(line).toBe(null)
    )

    it('findLine() not in doc', ->
      line = @doc.findLine($('#toolbar-container').get(0))
      expect(line).toBe(null)
    )

    it('findLine() id false positive', ->
      clone = @doc.root.firstChild.cloneNode(true)
      @doc.root.appendChild(clone)
      line = @doc.findLine(clone)
      expect(line).toBe(null)
    )

    it('findLine() leaf node', ->
      line = @doc.findLine(@doc.root.querySelector('b'))
      expect(line).toEqual(@doc.lines.last)
    )

    it('findLineAt() middle of line', ->
      [line, offset] = @doc.findLineAt(2)
      expect(line).toEqual(@doc.lines.first)
      expect(offset).toEqual(2)
    )

    it('findLineAt() last line', ->
      [line, offset] = @doc.findLineAt(8)
      expect(line).toEqual(@doc.lines.last)
      expect(offset).toEqual(2)
    )

    it('findLineAt() end of line', ->
      [line, offset] = @doc.findLineAt(4)
      expect(line).toEqual(@doc.lines.first)
      expect(offset).toEqual(4)
    )

    it('findLineAt() newline', ->
      [line, offset] = @doc.findLineAt(5)
      expect(line).toEqual(@doc.lines.first.next)
      expect(offset).toEqual(0)
    )

    it('findLineAt() end of document', ->
      [line, offset] = @doc.findLineAt(11)
      expect(line).toBe(@doc.lines.last)
      expect(offset).toEqual(5)
    )

    # TODO add test where finding line beyond last line (when line level format is present)

    it('findLineAt() beyond document', ->
      [line, offset] = @doc.findLineAt(12)
      expect(line).toBe(null)
      expect(offset).toEqual(1)
    )
  )

  describe('manipulation', ->
    beforeEach( ->
      @container.innerHTML = Quill.Normalizer.stripWhitespace('
        <div>
          <p><span>Test</span></p>
          <p><i>Test</i></p>
          <p><br></p>
          <p><br></p>
          <p><b>Test</b></p>
        </div>
      ')
      @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
      @lines = @doc.lines.toArray()
    )

    it('mergeLines() normal', ->
      @doc.mergeLines(@lines[0], @lines[1])
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span><i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() with newline', ->
      @doc.mergeLines(@lines[1], @lines[2])
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() from newline', ->
      @doc.mergeLines(@lines[3], @lines[4])
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() two newlines', ->
      @doc.mergeLines(@lines[2], @lines[3])
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('removeLine() existing', ->
      @doc.removeLine(@lines[1])
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('removeLine() lineNode missing', ->
      Quill.DOM.removeNode(@lines[1].node)
      @doc.removeLine(@lines[1])
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('splitLine() middle', ->
      @doc.splitLine(@lines[1], 2)
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Te</i></p>
        <p><i>st</i></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() beginning', ->
      @doc.splitLine(@lines[1], 0)
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><br></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() end', ->
      @doc.splitLine(@lines[1], 4)
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() beyond end', ->
      @doc.splitLine(@lines[1], 5)
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() split break', ->
      @doc.splitLine(@lines[2], 0)
      expect(@doc.root).toEqualHTML('
        <p><span>Test</span></p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('setHTML() valid', ->
      html = '<p><span>Test</span></p>'
      @doc.setHTML(html)
      expect(@doc.root).toEqualHTML(html, true)
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
      expect(@doc.root).toEqualHTML('
        <p><span>A</span></p>
        <p><span>B</span><br></p>
        <p><span>C</span></p>
        <p><b><br></b></p>
      ', true)
    )
  )

  describe('toDelta()', ->
    tests =
      'blank':
        initial:  ['']
        expected: Tandem.Delta.getInitial('')
      'single line':
        initial:  ['<p><span>0123</span></p>']
        expected: Tandem.Delta.getInitial('0123\n')
      'single newline':
        initial:  ['<p><br></p>']
        expected: Tandem.Delta.getInitial('\n')
      'preceding newline':
        initial:  ['<p><br></p>', '<p><span>0</span></p>']
        expected: Tandem.Delta.getInitial('\n0\n')
      'explicit trailing newline':
        initial:  ['<p><span>0</span></p>', '<p><br></p>']
        expected: Tandem.Delta.getInitial('0\n\n')
      'multiple lines':
        initial:  ['<p><span>0</span></p>', '<p><span>1</span></p>']
        expected: Tandem.Delta.getInitial('0\n1\n')
      'multiple newlines':
        initial:  ['<p><br></p>', '<p><br></p>']
        expected: Tandem.Delta.getInitial('\n\n')
      'multiple preceding newlines':
        initial:  ['<p><br></p>', '<p><br></p>', '<p><span>0</span></p>']
        expected: Tandem.Delta.getInitial('\n\n0\n')
      'multiple explicit trailing newlines':
        initial:  ['<p><span>0</span></p>', '<p><br></p>', '<p><br></p>']
        expected: Tandem.Delta.getInitial('0\n\n\n')
      'lines separated by multiple newlines':
        initial:  ['<p><span>0</span></p>', '<p><br></p>', '<p><span>1</span></p>']
        expected: Tandem.Delta.getInitial('0\n\n1\n')
      'tag format':
        initial:  ['<p><b>0123</b></p>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
          { value: '0123', attributes: { bold: true } }
          { value: '\n' }
        ]})
      'style format':
        initial:  ['<p><span style="color: teal;">0123</span></p>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, endLength: 5, ops: [
          { value: '0123', attributes: { color: 'teal' } }
          { value: '\n' }
        ]})

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial.join('')
        doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
        expect(doc.toDelta()).toEqualDelta(test.expected)
      )
    )
  )

  describe('rebuild()', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <p><span>0123</span></p>
          <p><span>5678</span></p>
        </div>'
      @doc = new Quill.Document(@container)
    )

    it('new line inserted', ->
      lineNode = @doc.root.ownerDocument.createElement(Quill.DOM.DEFAULT_BLOCK_TAG)
      lineNode.innerHTML = '<span>A</span>'
      @doc.root.insertBefore(lineNode, @doc.root.lastChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\nA\n5678\n'))
    )

    it('existing line changed', ->
      @doc.root.firstChild.innerHTML = '<span>01A23</span>'
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01A23\n5678\n'))
    )

    it('existing line removed', ->
      @doc.root.removeChild(@doc.root.firstChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '5678\n'))
    )

    it('existing line split', ->
      Quill.Utils.splitNode(@doc.root.firstChild, 2)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01\n23\n5678\n'))
    )

    it('existing lines merged', ->
      Quill.DOM.moveChildren(@doc.root.firstChild, @doc.root.lastChild)
      @doc.root.removeChild(@doc.root.lastChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '01235678\n'))
    )

    it('new lines appended', ->
      lineNode = @doc.root.ownerDocument.createElement(Quill.DOM.DEFAULT_BLOCK_TAG)
      lineNode.innerHTML = '<span>A</span>'
      @doc.root.appendChild(lineNode)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\n5678\nA\n'))
    )
  )
)
