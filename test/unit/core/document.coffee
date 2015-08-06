dom = Quill.Lib.DOM

describe('Document', ->
  beforeEach( ->
    @container = jasmine.clearContainer()
  )

  describe('constructor', ->
    tests =
      'blank':
        initial:  ''
        expected: ''
      'no change':
        initial:  '<div><b>Test</b></div>'
        expected: '<div><b>Test</b></div>'
      'text':
        initial:  'Test'
        expected: '<div>Test</div>'
      'inline':
        initial:  '<b>Test</b>'
        expected: '<div><b>Test</b></div>'
      'block pulling':
        initial:  '<div><div><div><div><b>Test</b><div>Test</div></div></div></div></div>'
        expected: '<div><b>Test</b></div><div>Test</div>'
      'with breaks':
        initial:  '<div>A<br>B<br>C</div>'
        expected: '<div>A<br></div><div>B<br></div><div>C</div>'
      'pull and break':
        initial:  '<div><div><div>A</div>B<br>C</div></div>'
        expected: '<div>A</div><div>B<br></div><div>C</div>'
      'list':
        initial:  '<div><ul><li>line</li></ul></div>'
        expected: '<ul><li>line</li></ul>'
      'nested divs':
        initial:  '<div><div>One<div><div>Alpha<div><div>I</div></div></div></div></div></div>'
        expected: '<div>One</div><div>Alpha</div><div>I</div>'
      'nested list':
        initial:  '<ul><li>One<ul><li>Alpha<ul><li>I</li></ul></li></ul></li></ul>'
        expected: '<ul><li>One</li><li>Alpha</li><li>I</li></ul>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        expect(@container.firstChild).toEqualHTML(test.expected, true)
        _.each(doc.lines.toArray(), (line) ->
          expect(dom.LINE_TAGS[line.node.tagName]).toBeDefined()
        )
      )
    )
  )

  describe('search', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div>0123</div>
          <div><br></div>
          <div><b>6789</b></div>
        </div>'
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
      expect(line).toBeUndefined()
    )

    it('findLine() not in doc', ->
      line = @doc.findLine($('#test-container').get(0))
      expect(line).toBeUndefined()
    )

    it('findLine() id false positive', ->
      clone = @doc.root.firstChild.cloneNode(true)
      @doc.root.appendChild(clone)
      line = @doc.findLine(clone)
      expect(line).toBeUndefined()
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
      expect(line).toBeUndefined()
      expect(offset).toEqual(1)
    )
  )

  describe('manipulation', ->
    beforeEach( ->
      @container.innerHTML = Quill.Normalizer.stripWhitespace('
        <div>
          <div>Test</div>
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
      expect(@doc.root).toEqualHTML('
        <div>Test<i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() with newline', ->
      @doc.mergeLines(@lines[1], @lines[2])
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() from newline', ->
      @doc.mergeLines(@lines[3], @lines[4])
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('mergeLines() two newlines', ->
      @doc.mergeLines(@lines[2], @lines[3])
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('removeLine() existing', ->
      @doc.removeLine(@lines[1])
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('removeLine() lineNode missing', ->
      dom(@lines[1].node).remove()
      @doc.removeLine(@lines[1])
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length - 1)
    )

    it('splitLine() middle', ->
      @doc.splitLine(@lines[1], 2)
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Te</i></div>
        <div><i>st</i></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() beginning', ->
      @doc.splitLine(@lines[1], 0)
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><br></div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() end', ->
      @doc.splitLine(@lines[1], 4)
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() beyond end', ->
      @doc.splitLine(@lines[1], 5)
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('splitLine() split break', ->
      @doc.splitLine(@lines[2], 0)
      expect(@doc.root).toEqualHTML('
        <div>Test</div>
        <div><i>Test</i></div>
        <div><br></div>
        <div><br></div>
        <div><br></div>
        <div><b>Test</b></div>
      ', true)
      expect(@doc.lines.length).toEqual(@lines.length + 1)
    )

    it('setHTML() valid', ->
      html = '<div>Test</div>'
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
        <div>A</div>
        <div>B<br></div>
        <div>C</div>
        <div><b></b><br></div>
      ', true)
    )

    it('setHTML() with comment', ->
      @doc.setHTML('
        <!-- HTML Comment -->
        <div>Test</div>
      ')
    )
  )

  describe('toDelta()', ->
    tests =
      'blank':
        initial:  ['']
        expected: new Quill.Delta()
      'single line':
        initial:  ['<div>0123</div>']
        expected: new Quill.Delta().insert('0123\n')
      'single newline':
        initial:  ['<div><br></div>']
        expected: new Quill.Delta().insert('\n')
      'preceding newline':
        initial:  ['<div><br></div>', '<div>0</div>']
        expected: new Quill.Delta().insert('\n0\n')
      'explicit trailing newline':
        initial:  ['<div>0</div>', '<div><br></div>']
        expected: new Quill.Delta().insert('0\n\n')
      'multiple lines':
        initial:  ['<div>0</div>', '<div>1</div>']
        expected: new Quill.Delta().insert('0\n1\n')
      'multiple newlines':
        initial:  ['<div><br></div>', '<div><br></div>']
        expected: new Quill.Delta().insert('\n\n')
      'multiple preceding newlines':
        initial:  ['<div><br></div>', '<div><br></div>', '<div>0</div>']
        expected: new Quill.Delta().insert('\n\n0\n')
      'multiple explicit trailing newlines':
        initial:  ['<div>0</div>', '<div><br></div>', '<div><br></div>']
        expected: new Quill.Delta().insert('0\n\n\n')
      'lines separated by multiple newlines':
        initial:  ['<div>0</div>', '<div><br></div>', '<div>1</div>']
        expected: new Quill.Delta().insert('0\n\n1\n')
      'tag format':
        initial:  ['<div><b>0123</b></div>']
        expected: new Quill.Delta().insert('0123', { bold: true }).insert('\n')
      'style format':
        initial:  ['<div><span style="color: teal;">0123</span></div>']
        expected: new Quill.Delta().insert('0123', { color: 'teal' }).insert('\n')
      'bullets':
        initial:  ['<ul><li>One</li><li>Two</li></ul>']
        expected: new Quill.Delta().insert('One').insert('\n', { bullet: true })
                                   .insert('Two').insert('\n', { bullet: true })

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
          <div>0123</div>
          <div>5678</div>
        </div>'
      @doc = new Quill.Document(@container)
    )

    it('new line inserted', ->
      lineNode = @doc.root.ownerDocument.createElement(dom.DEFAULT_BLOCK_TAG)
      lineNode.innerHTML = 'A'
      @doc.root.insertBefore(lineNode, @doc.root.lastChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(new Quill.Delta().insert('0123\nA\n5678\n'))
    )

    it('existing line changed', ->
      @doc.root.firstChild.innerHTML = '01A23'
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(new Quill.Delta().insert('01A23\n5678\n'))
    )

    it('existing line removed', ->
      @doc.root.removeChild(@doc.root.firstChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(new Quill.Delta().insert('5678\n'))
    )

    it('existing line split', ->
      dom(@doc.root.firstChild).split(2)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(new Quill.Delta().insert('01\n23\n5678\n'))
    )

    it('existing lines merged', ->
      dom(@doc.root.lastChild).moveChildren(@doc.root.firstChild)
      @doc.root.removeChild(@doc.root.lastChild)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(new Quill.Delta().insert('01235678\n'))
    )

    it('new lines appended', ->
      lineNode = @doc.root.ownerDocument.createElement(dom.DEFAULT_BLOCK_TAG)
      lineNode.innerHTML = 'A'
      @doc.root.appendChild(lineNode)
      @doc.rebuild()
      expect(@doc.toDelta()).toEqualDelta(new Quill.Delta().insert('0123\n5678\nA\n'))
    )
  )
)
