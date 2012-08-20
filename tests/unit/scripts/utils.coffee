#= require mocha
#= require chai
#= require utils
#= require jquery
#= require underscore

describe('Utils', ->
  describe('split', ->
    it('should correctly not split if not necessary', ->
      container = document.getElementById('test-base')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 0)
      expect(left).to.equal(null)
      expect(right).to.equal(container.firstChild)

      [left, right] = Tandem.Utils.Node.split(container.firstChild, 4)
      expect(left).to.equal(container.firstChild)
      expect(right).to.equal(null)
    )

    it('should correctly split text node', ->
      container = document.getElementById('test-text')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 2)
      expect(left.textContent).to.equal("Bo")
      expect(right.textContent).to.equal("ld")
      expect(container.innerHTML).to.equal('<b>Bo</b><b>ld</b>')
    )

    it('should correctly split child nodes', ->
      container = document.getElementById('test-node')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 6)
      expect(container.innerHTML).to.equal('<b><i>Italic</i></b><b><s>Strike</s></b>')
    )

    it('should correctly split child nodes and text', ->
      container = document.getElementById('test-both')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 2)
      expect(container.innerHTML).to.equal('<b><i>It</i></b><b><i>alic</i></b>')
    )

    it('should correctly split deep nodes', ->
      container = document.getElementById('test-complex')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 2)
      expect(container.innerHTML).to.equal('<b><i><s><u>On</u></s></i></b><b><i><s><u>e</u><u>Two</u></s><s>Three</s></i></b>')
    )
  )
)