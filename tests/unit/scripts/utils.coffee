#= require mocha
#= require chai
#= require utils
#= require jquery
#= require underscore

describe('Utils', ->
  describe('split', ->
    it('should not split if not necessary', ->
      container = document.getElementById('split-test-base')
      [left, right] = Tandem.Utils.splitNode(container.firstChild, 0)
      expect(left).to.equal(null)
      expect(right).to.equal(container.firstChild)

      [left, right] = Tandem.Utils.splitNode(container.firstChild, 4)
      expect(left).to.equal(container.firstChild)
      expect(right).to.equal(null)
    )

    it('should split text node', ->
      container = document.getElementById('split-test-text')
      [left, right] = Tandem.Utils.splitNode(container.firstChild, 2)
      expect(left.textContent).to.equal("Bo")
      expect(right.textContent).to.equal("ld")
      expect(Tandem.Utils.cleanHtml(container.innerHTML)).to.equal('<b>Bo</b><b>ld</b>')
    )

    it('should split child nodes', ->
      container = document.getElementById('split-test-node')
      [left, right] = Tandem.Utils.splitNode(container.firstChild, 6)
      expect(Tandem.Utils.cleanHtml(container.innerHTML)).to.equal('<b><i>Italic</i></b><b><s>Strike</s></b>')
    )

    it('should split child nodes and text', ->
      container = document.getElementById('split-test-both')
      [left, right] = Tandem.Utils.splitNode(container.firstChild, 2)
      expect(Tandem.Utils.cleanHtml(container.innerHTML)).to.equal('<b><i>It</i></b><b><i>alic</i></b>')
    )

    it('should split deep nodes', ->
      container = document.getElementById('split-test-complex')
      [left, right] = Tandem.Utils.splitNode(container.firstChild, 2)
      expect(Tandem.Utils.cleanHtml(container.innerHTML)).to.equal('<b><i><s><u>On</u></s></i></b><b><i><s><u>e</u><u>Two</u></s><s>Three</s></i></b>')
    )

    it('should split lines', ->
      container = document.getElementById('split-test-lines')
      [left, right] = Tandem.Utils.splitNode(container.firstChild, 1)
      expect(Tandem.Utils.cleanHtml(container.innerHTML)).to.equal('<div><b>1</b></div><div><b>23</b><i>456</i></div>')
    )
  )


  describe('extract', ->
    reset = ->
      $('#test-container').html(Tandem.Utils.cleanHtml('
        <div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>
      '))
      editor = new Tandem.Editor('test-container')
      editor.ignoreDomChanges = true
      return editor

    tests = [{
      name: 'should extract single node'
      start: 0
      end: 4
      fragment: 
        '<div>
          <b>Bold</b>
        </div>'
      remains: 
        '<div>
          <i>Italic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract portion of node'
      start: 0
      end: 2
      fragment:
        '<div>
          <b>Bo</b>
        </div>'
      remains: 
        '<div>
          <b>ld</b>
          <i>Italic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract multiple nodes'
      start: 12
      end: 14
      fragment:
        '<div>
          <i>b</i>
          <s>c</s>
        </div>'
      remains: 
        '<div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
          <b>a</b>
          <u>d</u>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract portions of multiple nodes'
      start: 2
      end: 8
      fragment:
        '<div>
          <b>ld</b>
          <i>Ital</i>
        </div>'
      remains: 
        '<div>
          <b>Bo</b>
          <i>ic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract portions of multiple nodes spanning multiple lines'
      start: 8
      end: 13
      fragment:
        '<div>
          <i>ic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
        </div>'
      remains: 
        '<div>
          <b>Bold</b>
          <i>Ital</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line'
      start: 11
      end: 15
      fragment:
        '<div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>'
      remains: 
        '<div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line with trailing newline'
      start: 11
      end: 16
      fragment:
        '<div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
        </div>'
      remains: 
        '<div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line with leading newline'
      start: 10
      end: 15
      fragment:
        '<div>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>'
      remains: 
        '<div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line with leading and trailing newline'
      start: 10
      end: 16
      fragment:
        '
        <div>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
        </div>'
      remains: 
        '<div>
          <b>Bold</b>
          <i>Italic</i>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract two entire lines'
      start: 0
      end: 15
      fragment:
        '<div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>'
      remains: 
        '<div>
        </div>
        <div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract two entire lines with trailing newline'
      start: 0
      end: 16
      fragment:
        '<div>
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div>
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div>
        </div>'
      remains: 
        '<div>
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }]

    _.each(tests, (test) ->
      test.fragment = Tandem.Utils.cleanHtml(test.fragment)
      test.remains = Tandem.Utils.cleanHtml(test.remains) 
    )

    _.each(tests, (test) ->
      it(test.name, ->
        editor = reset()
        [startLineNode, startOffset] = Tandem.Utils.getChildAtOffset(editor.doc.root, test.start)
        [endLineNode, endOffset] = Tandem.Utils.getChildAtOffset(editor.doc.root, test.end)
        extraction = Tandem.Utils.extractNodes(startLineNode, startOffset, endLineNode, endOffset)
        target = document.createElement('div')
        target.appendChild(extraction)
        expect("Fragment " + Tandem.Utils.cleanHtml(target.innerHTML)).to.equal("Fragment " + test.fragment)
        expect("Remains " + Tandem.Utils.cleanHtml(editor.doc.root.innerHTML)).to.equal("Remains " + test.remains)
      )
    )
  )


  describe('traversePreorder', ->
    reset = ->
      $('#test-container').html(Tandem.Utils.cleanHtml('
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
      Tandem.Utils.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
        return node
      )
    )

    it('should traverse with correct index', -> 
      reset()
      Tandem.Utils.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
        return node
      )
    )

    it('should handle rename', -> 
      reset()
      Tandem.Utils.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
          if node.tagName != 'SPAN'
            node = Tandem.Utils.switchTag(node, 'SPAN')
        return node
      )
      expect(Tandem.Utils.cleanHtml($('#test-container').html())).to.equal(Tandem.Utils.cleanHtml('
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
      Tandem.Utils.traversePreorder($('#test-container').get(0).firstChild, 0, (node, offset) ->
        if node.nodeType == node.ELEMENT_NODE
          expect(offset).to.equal(expected[node.textContent])
          if node.tagName == 'H2'
            node = Tandem.Utils.unwrap(node)
        return node
      )
      expect(Tandem.Utils.cleanHtml($('#test-container').html())).to.equal(Tandem.Utils.cleanHtml('
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