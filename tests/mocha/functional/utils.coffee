QuillHtmlTest = require('../lib/html-test')


describe('Utils', ->
  describe('splitNode', ->
    splitTest = new QuillHtmlTest(
      fn: (testContainer, expectedContainer, offset) ->
        Quill.Utils.splitNode(testContainer.firstChild, offset)
    )

    splitTest.run('should not split if not necessary 1',
      initial:  '<b>Bold</b>'
      expected: [0]
    , 0)

    splitTest.run('should not split if not necessary 2',
      initial:  '<b>Bold</b>'
      expected: [0]
    , 4)

    splitTest.run('should split text node',
      initial:  '<b>Bold</b>'
      expected: '<b>Bo</b><b>ld</b>'
    , 2)

    splitTest.run('should split child nodes',
      initial:  '<b><i>Italic</i><s>Strike</s></b>'
      expected: '<b><i>Italic</i></b><b><s>Strike</s></b>'
    , 6)

    splitTest.run('should split child nodes and text',
      initial:  '<b><i>Italic</i></b>'
      expected: '<b><i>It</i></b><b><i>alic</i></b>'
    , 2)

    splitTest.run('should split deep nodes',
      initial:  
        '<b><i>
          <s><u>One</u><u>Two</u></s>
          <s>Three</s>
        </i></b>'
      expected: 
        '<b><i>
          <s><u>On</u></s>
        </i></b>
        <b><i>
          <s><u>e</u><u>Two</u></s>
          <s>Three</s>
        </i></b>'
    , 2)

    splitTest.run('should split lines',
      initial:  [
        '<div><b>123</b><i>456</i></div>'
      ]
      expected: [
        '<div><b>1</b></div>'
        '<div><b>23</b><i>456</i></div>'
      ]
    , 1)
  )

  describe('splitBefore', ->
    splitTest = new QuillHtmlTest(
      fn: (testContainer, expectedContainer, target) ->
        Quill.Utils.splitBefore(target, testContainer)
      pre: (testContainer, expectedContainer) ->
        return testContainer.querySelector('#target')
    )
    splitTest.run('Normal',
      initial: 
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
      expected:
        '<div>
          <div>
            <div>One</div>
            <div>Two</div>
          </div>
          <div>
            <div>Three</div>
          </div>
        </div>
        <div>
          <div>
            <div>Four</div>
            <div>Five</div>
          </div>
        </div>'
    )
  )

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

    traverseTest = new QuillHtmlTest(
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
        Quill.Utils.traversePreorder(container.firstChild, 0, (node, offset) ->
          if node.nodeType == Quill.DOM.ELEMENT_NODE
            expect(offset).to.equal(expected[Quill.DOM.getText(node)])
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
        Quill.Utils.traversePreorder(container.firstChild, 0, (node, offset) ->
          if node.nodeType == Quill.DOM.ELEMENT_NODE
            expect(offset).to.equal(expected[Quill.DOM.getText(node)])
            node = Quill.DOM.switchTag(node, 'SPAN') if node.tagName != 'SPAN'
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
        Quill.Utils.traversePreorder(container.firstChild, 0, (node, offset) ->
          if node.nodeType == Quill.DOM.ELEMENT_NODE
            expect(offset).to.equal(expected[Quill.DOM.getText(node)])
            if node.tagName == 'H2'
              node = Quill.DOM.unwrap(node)
          return node
        )
    )
  )
)