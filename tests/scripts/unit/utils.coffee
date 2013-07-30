describe('Utils', ->
  describe('traversePreorder', ->
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

    traverseTest = new Scribe.Test.HtmlTest(
      initial: [
        '<div>
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
        </div>'
      ]
      expected: [0]
    )

    traverseTest.run('should traverse with correct index',
      checker: (container) ->
        Scribe.Utils.traversePreorder(container.firstChild, 0, (node, offset) ->
          if node.nodeType == Scribe.DOM.ELEMENT_NODE
            expect(offset).to.equal(expected[Scribe.DOM.getText(node)])
          return node
        )
    )

    traverseTest.run('should handle rename',
      expected: 
        '<div>
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
        </div>'
      fn: (container) ->
        Scribe.Utils.traversePreorder(container.firstChild, 0, (node, offset) ->
          if node.nodeType == Scribe.DOM.ELEMENT_NODE
            expect(offset).to.equal(expected[Scribe.DOM.getText(node)])
            node = Scribe.DOM.switchTag(node, 'SPAN') if node.tagName != 'SPAN'
          return node
        )
    )

    traverseTest.run('should handle unwrap',
      expected: 
        '<div>
          <h1>
            <b>One</b>
            <i>Two</i>
          </h1>
          <s>Three</s>
          <u>Four</u>
          <h3>
            <b>Five</b>
          </h3>
        </div>'
      fn: (container) ->
        Scribe.Utils.traversePreorder(container.firstChild, 0, (node, offset) ->
          if node.nodeType == Scribe.DOM.ELEMENT_NODE
            expect(offset).to.equal(expected[Scribe.DOM.getText(node)])
            if node.tagName == 'H2'
              node = Scribe.DOM.unwrap(node)
          return node
        )
    )
  )
)