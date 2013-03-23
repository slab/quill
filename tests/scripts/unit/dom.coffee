describe('DOM', ->
  describe('splitNode', ->
    splitTest = new Scribe.Test.LineTest((lineNode, target, offset) ->
      Scribe.DOM.splitNode(lineNode.firstChild, offset)
    )

    splitTest.run('should not split if not necessary 1',
      '<b>Bold</b>',
      '<b>Bold</b>'
    , 0)

    splitTest.run('should not split if not necessary 2',
      '<b>Bold</b>',
      '<b>Bold</b>'
    , 4)

    splitTest.run('should split text node',
      '<b>Bold</b>',
      '<b>Bo</b><b>ld</b>'
    , 2)

    splitTest.run('should split child nodes',
      '<b><i>Italic</i><s>Strike</s></b>',
      '<b><i>Italic</i></b><b><s>Strike</s></b>'
    , 6)

    splitTest.run('should split child nodes and text',
      '<b><i>Italic</i></b>',
      '<b><i>It</i></b><b><i>alic</i></b>'
    , 2)

    splitTest.run('should split deep nodes',
      '<b><i>
        <s><u>One</u><u>Two</u></s>
        <s>Three</s>
      </i></b>',
      '<b><i>
          <s><u>On</u></s>
      </i></b>
      <b><i>
        <s><u>e</u><u>Two</u></s>
        <s>Three</s>
      </i></b>'
    , 2)

    splitTest.run('should split lines',
      '<div><b>123</b><i>456</i></div>',
      '<div><b>1</b></div>
      <div><b>23</b><i>456</i></div>'
    , 1)
  )

  describe('splitAfter', ->
    splitTest = new Scribe.Test.HtmlTest((container, target) ->
      Scribe.DOM.splitAfter(target, container)
    , { target: 'target' })
    splitTest.run('Normal',
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
      </div>',
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