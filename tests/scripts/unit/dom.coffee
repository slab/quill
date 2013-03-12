describe('DOM', ->
  describe('splitNode', ->
    it('should not split if not necessary', ->
      container = document.getElementById('split-test-base')
      [left, right] = Scribe.DOM.splitNode(container.firstChild, 0)
      expect(left).to.equal(null)
      expect(right).to.equal(container.firstChild)

      [left, right] = Scribe.DOM.splitNode(container.firstChild, 4)
      expect(left).to.equal(container.firstChild)
      expect(right).to.equal(null)
    )

    it('should split text node', ->
      container = document.getElementById('split-test-text')
      [left, right] = Scribe.DOM.splitNode(container.firstChild, 2)
      expect(left.textContent).to.equal("Bo")
      expect(right.textContent).to.equal("ld")
      expect(Scribe.Utils.cleanHtml(container.innerHTML)).to.equal('<b>Bo</b><b>ld</b>')
    )

    it('should split child nodes', ->
      container = document.getElementById('split-test-node')
      [left, right] = Scribe.DOM.splitNode(container.firstChild, 6)
      expect(Scribe.Utils.cleanHtml(container.innerHTML)).to.equal('<b><i>Italic</i></b><b><s>Strike</s></b>')
    )

    it('should split child nodes and text', ->
      container = document.getElementById('split-test-both')
      [left, right] = Scribe.DOM.splitNode(container.firstChild, 2)
      expect(Scribe.Utils.cleanHtml(container.innerHTML)).to.equal('<b><i>It</i></b><b><i>alic</i></b>')
    )

    it('should split deep nodes', ->
      container = document.getElementById('split-test-complex')
      [left, right] = Scribe.DOM.splitNode(container.firstChild, 2)
      expect(Scribe.Utils.cleanHtml(container.innerHTML)).to.equal('<b><i><s><u>On</u></s></i></b><b><i><s><u>e</u><u>Two</u></s><s>Three</s></i></b>')
    )

    it('should split lines', ->
      container = document.getElementById('split-test-lines')
      [left, right] = Scribe.DOM.splitNode(container.firstChild, 1)
      expect(Scribe.Utils.cleanHtml(container.innerHTML)).to.equal('<div><b>1</b></div><div><b>23</b><i>456</i></div>')
    )
  )

  describe('splitAfter', ->
    tests = {
      'Normal':
        before: 
          '<div>
            <div>
              <div>One</div>
              <div>Two</div>
            </div>
            <div>
              <div>Three</div>
              <div id="target">Four</div>
              <div>Five</div>
            </div>
          </div>'
        after:
          '<div>
            <div>
              <div>One</div>
              <div>Two</div>
            </div>
            <div>
              <div>Three</div>
              <div id="target">Four</div>
            </div>
          </div>
          <div>
            <div>
              <div>Five</div>
            </div>
          </div>'
    }
    _.each(tests, (test, name) ->
      it(name, ->
        root = $('#test-container').get(0)
        $('#test-container').html(Scribe.Utils.cleanHtml(test.before, true))
        target = $('#test-container #target').get(0)
        Scribe.DOM.splitAfter(target, root)
        expect(root.innerHTML).to.equal(Scribe.Utils.cleanHtml(test.after, true))
      )
    )
  )

  describe('traversePreorder', ->
    reset = ->
      $('#test-container').html(Scribe.Utils.cleanHtml('
        <div>
          <h1>
            <b>One</b>
            <i>Two</i>
          </h1>
          <h2>
            <s>Three</s>
            <u>Four</u>
          </h2>
          <h3>
            <b>Five</b>
          </h3>
        </div>
      '))

    # 0  3  6    1   5   9  
    # OneTwoThreeFourFiveSix
    expected = {
      'OneTwo'     : 0
      'One'        : 0
      'Two'        : 3
      'ThreeFour'  : 6
      'Three'      : 6
      'Four'       : 11
      'Five'       : 15
    }

    it('should traverse in preorder', -> 
      reset()
      Scribe.DOM.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
        return node
      )
    )

    it('should traverse with correct index', -> 
      reset()
      Scribe.DOM.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
        return node
      )
    )

    it('should handle rename', -> 
      reset()
      Scribe.DOM.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
          if node.tagName != 'SPAN'
            node = Scribe.DOM.switchTag(node, 'SPAN')
        return node
      )
      expect(Scribe.Utils.cleanHtml($('#test-container').html())).to.equal(Scribe.Utils.cleanHtml('
        <div>
          <span>
            <span>One</span>
            <span>Two</span>
          </span>
          <span>
            <span>Three</span>
            <span>Four</span>
          </span>
          <span>
            <span>Five</span>
          </span>
        </div>
      ')) 
    )

    it('should handle unwrap', -> 
      reset()
      Scribe.DOM.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
          if node.tagName == 'H2'
            node = Scribe.DOM.unwrap(node)
        return node
      )
      expect(Scribe.Utils.cleanHtml($('#test-container').html())).to.equal(Scribe.Utils.cleanHtml('
        <div>
          <h1>
            <b>One</b>
            <i>Two</i>
          </h1>
          <s>Three</s>
          <u>Four</u>
          <h3>
            <b>Five</b>
          </h3>
        </div>
      '))
    )
  )
)