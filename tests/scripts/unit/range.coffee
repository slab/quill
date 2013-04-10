describe('Range', ->
  describe('Position', ->
    positionTests = new Scribe.Test.EditorTest(
      initial: [
        '<div><b>12</b><i>34</i></div>'
        '<div><s>56</s><u>78</u></div>'
        '<div><br></div>'
      ]
      expected: [0, 1, 2]
    )

    positionTests.run('should correctly initialize position from index',
      checker: (editor) ->
        expectedResults = [
          { text: '12', offset: 0 }
          { text: '12', offset: 1 }
          { text: '34', offset: 0 }
          { text: '34', offset: 1 }
          { text: '34', offset: 2 }
          { text: '56', offset: 0 }
          { text: '56', offset: 1 }
          { text: '78', offset: 0 }
          { text: '78', offset: 1 }
          { text: '78', offset: 2 }
          { text: '', offset: 0 }
        ]
        _.each(expectedResults, (result, i) ->
          position = new Scribe.Position(editor, i)
          expect(position.leafNode.textContent).to.equal(result.text)
          expect(position.offset).to.equal(result.offset)
        )
    )
  )



  describe('getText', ->
    textTests = new Scribe.Test.EditorTest(
      initial: 
        '<div>
          <b>abc</b>
          <i>def</i>
        </div>
        <div>
          <b>
            <s>hi</s>
          </b>
          <b>
            <i>jk</i>
            <u>lm</u>
          </b>
          <b>
            <s>no</s>
          </b>
        </div>
        <div>
          <s>p</s>
          <u>q</u>
          <s>r</s>
          <u>s</u>
        </div>'
      expected: [0]
    )
    text = "abcdef\nhijklmno\npqrs"

    textTests.run('should identifiy single node',
      checker: (editor) ->
        _.each(text.split(''), (char, index) ->
          range = new Scribe.Range(editor, index, index + 1)
          expect(range.getText()).to.equal(char)
        )
    )

    textTests.run('should identifiy entire document',
      checker: (editor) ->
        range = new Scribe.Range(editor, 0, text.length)
        expect(range.getText()).to.equal(text)
    )
  )



  describe('getFormats', ->
    

    formatTests = new Scribe.Test.EditorTest(
      initial:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>
            <s>78</s>
          </b>
          <b>
            <i>90</i>
            <u>12</u>
          </b>
          <b>
            <s>34</s>
          </b>
        </div>
        <div>
          <s>5</s>
          <u>6</u>
          <s>7</s>
          <u>8</u>
        </div>'
      expected: [0]
      checker: (testEditor, expectedEditor, start, end, text, formats) ->
        range = new Scribe.Range(testEditor, start, end)
        expect(range.getText()).to.equal(text)
        expect(range.getFormats()).to.eql(_.extend({}, Scribe.Leaf.DEFAULT_FORMATS, formats))
    )

    formatTests.run('inside of node', {}, 1, 2, '2', { bold: true })
    formatTests.run('start of node', {}, 0, 1, '1', { bold: true })
    formatTests.run('end of node', {}, 2, 3, '3', { bold: true })
    formatTests.run('entire node', {}, 0, 3, '123', { bold: true })
    formatTests.run('cursor inside of node', {}, 1, 1, '', { bold: true })
    formatTests.run('cursor at start of node', {}, 0, 0, '', { bold: true })
    formatTests.run('cursor at end of node', {}, 3, 3, '', { italic: true })
    formatTests.run('node at end of document', {}, 19, 20, '8', { underline: true })
    formatTests.run('cursor at end of document', {}, 20, 20, '', { underline: true })
    formatTests.run('part of two nodes', {}, 8, 10, '89', { bold: true })
    formatTests.run('node with preceding newline', {}, 6, 9, '\n78', { bold: true, strike: true })
    formatTests.run('node with trailing newline', {}, 13, 16, '34\n', { bold: true, strike: true })
    formatTests.run('line with preceding and trailing newline', {}, 6, 16, "\n78901234\n", { bold: true })
  )



  describe('getLeafNodes', ->
    reset = ->
      $('#test-container').html()
      editor = new Scribe.Editor('test-container', false)
      line1 = editor.root.firstChild
      line2 = editor.root.lastChild
      return [editor, editor.root, line1, line2]

    leafTests = new Scribe.Test.EditorTest(
      initial: [
        '<div><b>123</b><i>456</i></div>'
        '<div><s>7</s><u>8</u><s>9</s><u>0</u></div>'
      ]
      expected: [0, 1]
    )

    leafTests.run('should select a single node at boundaries',
      checker: (editor) ->
        range = new Scribe.Range(editor, 0, 3)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(1)
        expect(nodes[0]).to.equal(editor.root.firstChild.firstChild)
    )

    leafTests.run('should select multiple nodes at boundaries',
      checker: (editor) ->
        range = new Scribe.Range(editor, 0, 6)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(2)
        expect(nodes[0]).to.equal(editor.root.firstChild.childNodes[0])
        expect(nodes[1]).to.equal(editor.root.firstChild.childNodes[1])
    )

    leafTests.run('should select a single node inside boundaries',
      checker: (editor) ->
        for i in [0..2]
          range = new Scribe.Range(editor, i, i+1)
          nodes = range.getLeafNodes()
          expect(nodes.length).to.equal(1)
          expect(nodes[0]).to.equal(editor.root.firstChild.firstChild)
    )

    leafTests.run('should select multipe nodes inside boundaries',
      checker: (editor) ->
        for i in [0..2]
          range = new Scribe.Range(editor, i, i+4)
          nodes = range.getLeafNodes()
          expect(nodes.length).to.equal(2)
          expect(nodes[0]).to.equal(editor.root.firstChild.childNodes[0])
          expect(nodes[1]).to.equal(editor.root.firstChild.childNodes[1])
    )

    leafTests.run('should select multiple nodes across lines within boundaries',
      checker: (editor) ->
        range = new Scribe.Range(editor, 0, 6)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(2)
        expect(nodes[0]).to.equal(editor.root.firstChild.childNodes[0])
        expect(nodes[1]).to.equal(editor.root.firstChild.childNodes[1])
    )

    leafTests.run('should select multiple nodes across lines outside boundaries',
      checker: (editor) ->
        range = new Scribe.Range(editor, 5, 8)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(2)
        expect(nodes[0]).to.equal(editor.root.firstChild.lastChild)
        expect(nodes[1]).to.equal(editor.root.lastChild.firstChild)
    )

    leafTests.run('should select node collapsed',
      checker: (editor) ->
        for i in [0..2]
          range = new Scribe.Range(editor, i, i)
          nodes = range.getLeafNodes()
          expect(nodes.length).to.equal(1)
          expect(nodes[0]).to.equal(editor.root.firstChild.firstChild)
    )
  )
)
