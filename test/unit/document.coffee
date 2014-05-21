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
        initial:  '<p><b>Test</b></p>'
        expected: '<p><b>Test</b></p>'
      'text':
        initial:  'Test'
        expected: '<p>Test</p>'
      'inline':
        initial:  '<b>Test</b>'
        expected: '<p><b>Test</b></p>'
      'block pulling':
        initial:  '<div><div><div><div><b>Test</b><div>Test</div></div></div></div></div>'
        expected: '<p><b>Test</b></p><p>Test</p>'
      'with breaks':
        initial:  '<p>A<br>B<br>C</p>'
        expected: '<p>A<br></p><p>B<br></p><p>C</p>'
      'pull and break':
        initial:  '<div><div><div>A</div>B<br>C</div></div>'
        expected: '<p>A</p><p>B<br></p><p>C</p>'

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
          <p>0123</p>
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
      node.innerHTML = 'Test'
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
          <p>Test</p>
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
        <p>Test<i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() with newline', ->
      @doc.mergeLines(@lines[1], @lines[2])
      expect(@doc.root).toEqualHTML('
        <p>Test</p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() from newline', ->
      @doc.mergeLines(@lines[3], @lines[4])
      expect(@doc.root).toEqualHTML('
        <p>Test</p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() two newlines', ->
      @doc.mergeLines(@lines[2], @lines[3])
      expect(@doc.root).toEqualHTML('
        <p>Test</p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('removeLine() existing', ->
      @doc.removeLine(@lines[1])
      expect(@doc.root).toEqualHTML('
        <p>Test</p>
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
        <p>Test</p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('splitLine() middle', ->
      @doc.splitLine(@lines[1], 2)
      expect(@doc.root).toEqualHTML('
        <p>Test</p>
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
        <p>Test</p>
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
        <p>Test</p>
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
        <p>Test</p>
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
        <p>Test</p>
        <p><i>Test</i></p>
        <p><br></p>
        <p><br></p>
        <p><br></p>
        <p><b>Test</b></p>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('setHTML() valid', ->
      html = '<p>Test</p>'
      @doc.setHTML(html)
      expect(@doc.root).toEqualHTML(html, true)
    )

    it('setHTML() invalid', ->
      @doc.setHTML('
        <div>
          <div>
            <div>A</div>B<br>C</div>
          </div>
        </div>
        <div>
          <b></b>
        </div>
      ')
      expect(@doc.root).toEqualHTML('
        <p>A</p>
        <p>B<br></p>
        <p>C</p>
        <p><b></b><br></p>
      ', true)
    )

    it('setHTML() with comment', ->
      @doc.setHTML('
        <!-- HTML Comment -->
        <p>Test</p>
      ')
    )
  )

  describe('toDelta()', ->
    tests =
      'blank':
        initial:  ['']
        expected: Tandem.Delta.getInitial('')
      'single line':
        initial:  ['<p>0123</p>']
        expected: Tandem.Delta.getInitial('0123\n')
      'single newline':
        initial:  ['<p><br></p>']
        expected: Tandem.Delta.getInitial('\n')
      'preceding newline':
        initial:  ['<p><br></p>', '<p>0</p>']
        expected: Tandem.Delta.getInitial('\n0\n')
      'explicit trailing newline':
        initial:  ['<p>0</p>', '<p><br></p>']
        expected: Tandem.Delta.getInitial('0\n\n')
      'multiple lines':
        initial:  ['<p>0</p>', '<p>1</p>']
        expected: Tandem.Delta.getInitial('0\n1\n')
      'multiple newlines':
        initial:  ['<p><br></p>', '<p><br></p>']
        expected: Tandem.Delta.getInitial('\n\n')
      'multiple preceding newlines':
        initial:  ['<p><br></p>', '<p><br></p>', '<p>0</p>']
        expected: Tandem.Delta.getInitial('\n\n0\n')
      'multiple explicit trailing newlines':
        initial:  ['<p>0</p>', '<p><br></p>', '<p><br></p>']
        expected: Tandem.Delta.getInitial('0\n\n\n')
      'lines separated by multiple newlines':
        initial:  ['<p>0</p>', '<p><br></p>', '<p>1</p>']
        expected: Tandem.Delta.getInitial('0\n\n1\n')
      'tag format':
        initial:  ['<p><b>0123</b></p>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, ops: [
          { value: '0123', attributes: { bold: true } }
          { value: '\n' }
        ]})
      'style format':
        initial:  ['<p><span style="color: teal;">0123</span></p>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, ops: [
          { value: '0123', attributes: { color: 'teal' } }
          { value: '\n' }
        ]})
      'bullets':
        initial:  ['<ul><li>One</li><li>Two</li></ul>']
        expected: Tandem.Delta.makeDelta({ startLength: 0, ops: [
          { value: 'One' }
          { value: '\n', attributes: { bullet: true } }
          { value: 'Two' }
          { value: '\n', attributes: { bullet: true } }
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
          <p>0123</p>
          <p>5678</p>
        </div>'
      @doc = new Quill.Document(@container)
    )

    it('new line inserted', ->
      lineNode = @doc.root.ownerDocument.createElement(Quill.DOM.DEFAULT_BLOCK_TAG)
      lineNode.innerHTML = 'A'
      @doc.root.insertBefore(lineNode, @doc.root.lastChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\nA\n5678\n'))
    )

    it('existing line changed', ->
      @doc.root.firstChild.innerHTML = '01A23'
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
      lineNode.innerHTML = 'A'
      @doc.root.appendChild(lineNode)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\n5678\nA\n'))
    )
  )
)
