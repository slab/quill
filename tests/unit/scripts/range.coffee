#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore


describe('Range', ->
  describe('Position', ->
    $('#editor-container').append('<div class="line"><b>12</b><i>34</i></div><div class="line"><s>56</s><u>78</u>')
    editor = new Tandem.Editor('editor-container')

    it('should correctly initialize position from index', ->
      positions = []
      numPositions = editor.iframeDoc.body.textContent.length + editor.iframeDoc.body.childNodes.length - 1
      positions = _.map([0..numPositions], (i) ->
        return new Tandem.Position(editor, i)
      )

      expect(positions[0].node.textContent).to.equal('12')
      expect(positions[0].offset).to.equal(0)

      expect(positions[1].node.textContent).to.equal('12')
      expect(positions[1].offset).to.equal(1)

      expect(positions[2].node.textContent).to.equal('34')
      expect(positions[2].offset).to.equal(0)

      expect(positions[3].node.textContent).to.equal('34')
      expect(positions[3].offset).to.equal(1)

      expect(positions[4].node.textContent).to.equal('34')
      expect(positions[4].offset).to.equal(2)

      expect(positions[5].node.textContent).to.equal('56')
      expect(positions[5].offset).to.equal(0)

      expect(positions[6].node.textContent).to.equal('56')
      expect(positions[6].offset).to.equal(1)

      expect(positions[7].node.textContent).to.equal('78')
      expect(positions[7].offset).to.equal(0)

      expect(positions[8].node.textContent).to.equal('78')
      expect(positions[8].offset).to.equal(1)

      expect(positions[9].node.textContent).to.equal('78')
      expect(positions[9].offset).to.equal(2)
    )
  )
)

