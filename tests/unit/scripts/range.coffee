#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Range', ->
  describe('Position', ->
    it('should correctly initialize position from index', ->
      $('#editor-container').html('<div><b>12</b><i>34</i></div><div><s>56</s><u>78</u></div><div><br></div>')
      editor = new Tandem.Editor('editor-container')
      numPositions = editor.doc.root.textContent.length + editor.doc.root.childNodes.length - 1
      positions = _.map([0..numPositions], (i) ->
        return new Tandem.Position(editor, i)
      )

      expect(positions[0].leafNode.textContent).to.equal('12')
      expect(positions[0].offset).to.equal(0)

      expect(positions[1].leafNode.textContent).to.equal('12')
      expect(positions[1].offset).to.equal(1)

      expect(positions[2].leafNode.textContent).to.equal('34')
      expect(positions[2].offset).to.equal(0)

      expect(positions[3].leafNode.textContent).to.equal('34')
      expect(positions[3].offset).to.equal(1)

      expect(positions[4].leafNode.textContent).to.equal('34')
      expect(positions[4].offset).to.equal(2)

      expect(positions[5].leafNode.textContent).to.equal('56')
      expect(positions[5].offset).to.equal(0)

      expect(positions[6].leafNode.textContent).to.equal('56')
      expect(positions[6].offset).to.equal(1)

      expect(positions[7].leafNode.textContent).to.equal('78')
      expect(positions[7].offset).to.equal(0)

      expect(positions[8].leafNode.textContent).to.equal('78')
      expect(positions[8].offset).to.equal(1)

      expect(positions[9].leafNode.textContent).to.equal('78')
      expect(positions[9].offset).to.equal(2)

      expect(positions[10].leafNode.nodeName).to.equal('BR')
      expect(positions[10].offset).to.equal(0)
    )
  )


  describe('getAttributeIntersection', ->
    tests = [{
      name: 'inside of node'
      start: 1
      end: 2
      attributes: { bold: true }
    }, {
      name: 'start of node'
      start: 0
      end: 1
      attributes: { bold: true }
    }, {
      name: 'end of node'
      start: 2
      end: 3
      attributes: { bold: true }
    }, {
      name: 'entire node'
      start: 0
      end: 3
      attributes: { bold: true }
    }, {
      name: 'cursor inside of node'
      start: 1
      end: 1
      attributes: { bold: true }
    }, {
      name: 'cursor at start of node'
      start: 0
      end: 0
      attributes: { bold: true }
    }, {
      name: 'cursor at end of node'
      start: 3
      end: 3
      attributes: { italic: true }
    }, {
      name: 'node at end of document'
      start: 10
      end: 11
      attributes: { underline: true }
    }, {
      name: 'cursor at end of document'
      start: 11
      end: 11
      attributes: { underline: true }
    }]

    $('#editor-container').html('<div><b>123</b><i>456</i></div><div><s>7</s><u>8</u><s>9</s><u>0</u>')
    editor = new Tandem.Editor('editor-container')

    _.each(tests, (test) ->
      it(test.name, ->
        range = new Tandem.Range(editor, test.start, test.end)
        attributes = range.getAttributeIntersection()
        expect(attributes).to.eql(test.attributes)
      )
    )
  )


  describe('getLeafNodes', ->
    $('#editor-container').html('<div><b>123</b><i>456</i></div><div><s>7</s><u>8</u><s>9</s><u>0</u>')
    editor = new Tandem.Editor('editor-container')
    container = editor.doc.root
    line1 = container.firstChild
    line2 = container.lastChild

    it('should select a single node at boundaries', ->
      range = new Tandem.Range(editor, 0, 3)
      nodes = range.getLeafNodes()
      expect(nodes.length).to.equal(1)
      expect(nodes[0]).to.equal(line1.firstChild)
    )
    it('should select multiple nodes at boundaries', ->
      range = new Tandem.Range(editor, 0, 6)
      nodes = range.getLeafNodes()
      expect(nodes.length).to.equal(2)
      expect(nodes[0]).to.equal(line1.childNodes[0])
      expect(nodes[1]).to.equal(line1.childNodes[1])
    )
    it('should select a single node inside boundaries', ->
      for i in [0..2]
        range = new Tandem.Range(editor, i, i+1)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(1)
        expect(nodes[0]).to.equal(line1.firstChild)
    )
    it('should select multipe nodes inside boundaries', ->
      for i in [0..2]
        range = new Tandem.Range(editor, i, i+4)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(2)
        expect(nodes[0]).to.equal(line1.childNodes[0])
        expect(nodes[1]).to.equal(line1.childNodes[1])
    )
    it('should select multiple nodes across lines within boundaries', ->
      range = new Tandem.Range(editor, 0, 6)
      nodes = range.getLeafNodes()
      expect(nodes.length).to.equal(2)
      expect(nodes[0]).to.equal(line1.childNodes[0])
      expect(nodes[1]).to.equal(line1.childNodes[1])
    )
    it('should select multiple nodes across lines outside boundaries', ->
      range = new Tandem.Range(editor, 5, 8)
      nodes = range.getLeafNodes()
      expect(nodes.length).to.equal(2)
      expect(nodes[0]).to.equal(line1.lastChild)
      expect(nodes[1]).to.equal(line2.firstChild)
    )
    it('should select node collapsed', ->
      for i in [0..2]
        range = new Tandem.Range(editor, i, i)
        nodes = range.getLeafNodes()
        expect(nodes.length).to.equal(1)
        expect(nodes[0]).to.equal(line1.firstChild)
    )
  )
)
