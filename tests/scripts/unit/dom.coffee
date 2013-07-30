describe('DOM', ->
  describe('splitNode', ->
    splitTest = new Scribe.Test.HtmlTest(
      fn: (testContainer, expectedContainer, offset) ->
        Scribe.DOM.splitNode(testContainer.firstChild, offset)
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
    splitTest = new Scribe.Test.HtmlTest(
      fn: (testContainer, expectedContainer, target) ->
        Scribe.DOM.splitBefore(target, testContainer)
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
)