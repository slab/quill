#= require mocha
#= require chai
#= require utils
#= require jquery
#= require underscore

describe('Utils', ->
  describe('split', ->
    it('should not split if not necessary', ->
      container = document.getElementById('split-test-base')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 0)
      expect(left).to.equal(null)
      expect(right).to.equal(container.firstChild)

      [left, right] = Tandem.Utils.Node.split(container.firstChild, 4)
      expect(left).to.equal(container.firstChild)
      expect(right).to.equal(null)
    )

    it('should split text node', ->
      container = document.getElementById('split-test-text')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 2)
      expect(left.textContent).to.equal("Bo")
      expect(right.textContent).to.equal("ld")
      expect(container.innerHTML).to.equal('<b>Bo</b><b>ld</b>')
    )

    it('should split child nodes', ->
      container = document.getElementById('split-test-node')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 6)
      expect(container.innerHTML).to.equal('<b><i>Italic</i></b><b><s>Strike</s></b>')
    )

    it('should split child nodes and text', ->
      container = document.getElementById('split-test-both')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 2)
      expect(container.innerHTML).to.equal('<b><i>It</i></b><b><i>alic</i></b>')
    )

    it('should split deep nodes', ->
      container = document.getElementById('split-test-complex')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 2)
      expect(container.innerHTML).to.equal('<b><i><s><u>On</u></s></i></b><b><i><s><u>e</u><u>Two</u></s><s>Three</s></i></b>')
    )

    it('should split lines', ->
      container = document.getElementById('split-test-lines')
      [left, right] = Tandem.Utils.Node.split(container.firstChild, 1)
      expect(container.innerHTML).to.equal('<div class="line"><b>1</b></div><div class="line"><b>23</b><i>456</i></div>')
    )
  )


  describe('extract', ->
    reset = ->
      $('#test-container').html(Tandem.Utils.removeHtmlWhitespace('
        <div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>
      '))
      editor = new Tandem.Editor('test-container')
      return editor

    tests = [{
      name: 'should extract single node'
      start: 0
      end: 4
      fragment: 
        '<div class="line">
          <b>Bold</b>
        </div>'
      remains: 
        '<div class="line">
          <i>Italic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract portion of node'
      start: 0
      end: 2
      fragment:
        '<div class="line">
          <b>Bo</b>
        </div>'
      remains: 
        '<div class="line">
          <b>ld</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract multiple nodes'
      start: 12
      end: 14
      fragment:
        '<div class="line">
          <i>b</i>
          <s>c</s>
        </div>'
      remains: 
        '<div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>a</b>
          <u>d</u>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract portions of multiple nodes'
      start: 2
      end: 8
      fragment:
        '<div class="line">
          <b>ld</b>
          <i>Ital</i>
        </div>'
      remains: 
        '<div class="line">
          <b>Bo</b>
          <i>ic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract portions of multiple nodes spanning multiple lines'
      start: 8
      end: 13
      fragment:
        '<div class="line">
          <i>ic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
        </div>'
      remains: 
        '<div class="line">
          <b>Bold</b>
          <i>Ital</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line'
      start: 11
      end: 15
      fragment:
        '<div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>'
      remains: 
        '<div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line with trailing newline'
      start: 11
      end: 16
      fragment:
        '<div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
        </div>'
      remains: 
        '<div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line with leading newline'
      start: 10
      end: 15
      fragment:
        '<div class="line">
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>'
      remains: 
        '<div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract an entire line with leading and trailing newline'
      start: 10
      end: 16
      fragment:
        '
        <div class="line">
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
        </div>'
      remains: 
        '<div class="line">
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
        '<div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>'
      remains: 
        '<div class="line">
        </div>
        <div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }, {
      name: 'should extract two entire lines with trailing newline'
      start: 0
      end: 16
      fragment:
        '<div class="line">
          <b>Bold</b>
          <i>Italic</i>
        </div>
        <div class="line">
          <b>a</b>
          <i>b</i>
          <s>c</s>
          <u>d</u>
        </div>
        <div class="line">
        </div>'
      remains: 
        '<div class="line">
          <b>Bold2</b>
          <i>Italic2</i>
        </div>'
    }]

    _.each(tests, (test) ->
      test.fragment = Tandem.Utils.removeHtmlWhitespace(test.fragment)
      test.remains = Tandem.Utils.removeHtmlWhitespace(test.remains) 
    )

    _.each(tests, (test) ->
      it(test.name, ->
        editor = reset()
        extraction = Tandem.Utils.Node.extract(editor, test.start, test.end)
        target = document.createElement('div')
        target.appendChild(extraction)
        expect("Fragment " + target.innerHTML).to.equal("Fragment " + test.fragment)
        expect("Remains " + editor.iframeDoc.body.innerHTML).to.equal("Remains " + test.remains)
      )
    )
  )
)