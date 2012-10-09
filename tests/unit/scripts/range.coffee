#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Range', ->
  describe('Position', ->
    it('should correctly initialize position from index', ->
      $('#editor-container').html(Tandem.Utils.cleanHtml('
        <div>
          <b>12</b>
          <i>34</i>
        </div>
        <div>
          <s>56</s>
          <u>78</u>
        </div>
        <div>
          <br>
        </div>'))
      editor = new Tandem.Editor('editor-container')
      numPositions = 10
      positions = _.map([0..numPositions], (i) ->
        position = new Tandem.Position(editor, i)
        return position
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



  describe('getText', ->
    $('#editor-container').html(Tandem.Utils.cleanHtml('
      <div>
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
      <div>
        <s>5</s>
        <u>6</u>
        <s>7</s>
        <u>8</u>
      </div>'))
    editor = new Tandem.Editor('editor-container')
    text = "123456\n78901234\n5678"

    it('should identifiy single node', ->
      _.each(text.split(''), (char, index) ->
        range = new Tandem.Range(editor, index, index + 1)
        expect(range.getText()).to.equal(char)
      )
    )

    it('should identifiy entire document', ->
      range = new Tandem.Range(editor, 0, text.length)
      expect(range.getText()).to.equal(text)
    )
  )



  describe('getAttributeIntersection', ->
    tests = [{
      name: 'inside of node'
      start: 1
      end: 2
      text: '2'
      attributes: { bold: true }
    }, {
      name: 'start of node'
      start: 0
      end: 1
      text: '1'
      attributes: { bold: true }
    }, {
      name: 'end of node'
      start: 2
      end: 3
      text: '3'
      attributes: { bold: true }
    }, {
      name: 'entire node'
      start: 0
      end: 3
      text: '123'
      attributes: { bold: true }
    }, {
      name: 'cursor inside of node'
      start: 1
      end: 1
      text: ''
      attributes: { bold: true }
    }, {
      name: 'cursor at start of node'
      start: 0
      end: 0
      text: ''
      attributes: { bold: true }
    }, {
      name: 'cursor at end of node'
      start: 3
      end: 3
      text: ''
      attributes: { italic: true }
    }, {
      name: 'node at end of document'
      start: 19
      end: 20
      text: '8'
      attributes: { underline: true }
    }, {
      name: 'cursor at end of document'
      start: 20
      end: 20
      text: ''
      attributes: { underline: true }
    }, {
      name: 'part of two nodes'
      start: 8
      end: 10
      text: "89"
      attributes: { bold: true }
    }, {
      name: 'node with preceding newline'
      start: 6
      end: 9
      text: "\n78"
      attributes: { bold: true, strike: true }
    }, {
      name: 'node with trailing newline'
      start: 13
      end: 16
      text: "34\n"
      attributes: { bold: true, strike: true }
    }, {
      name: 'line with preceding and trailing newline'
      start: 6
      end: 16
      text: "\n78901234\n"
      attributes: { bold: true }
    }]

    $('#editor-container').html(Tandem.Utils.cleanHtml('
      <div>
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
      <div>
        <s>5</s>
        <u>6</u>
        <s>7</s>
        <u>8</u>
      </div>'))
    editor = new Tandem.Editor('editor-container')

    _.each(tests, (test) ->
      it(test.name, ->
        range = new Tandem.Range(editor, test.start, test.end)
        expect(range.getText()).to.equal(test.text)
        expect(range.getAttributeIntersection()).to.eql(test.attributes)
      )
    )
  )



  describe('getLeafNodes', ->
    $('#editor-container').html('<div><b>123</b><i>456</i></div><div><s>7</s><u>8</u><s>9</s><u>0</u></div>')
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
