#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Editor', ->
  describe('transformSelection', ->
    reset = ->
      $('#editor-container').html('<div><b>01234567890</b></div>')
      return new Tandem.Editor('editor-container')

    it('should insert before', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 1)
      [selStart, selEnd] = editor.transformSelection(mod, sel, 1)
      expect(selStart).to.equal(4)
      expect(selEnd).to.equal(8)
    )

    it('should insert after', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 8)
      [selStart, selEnd] = editor.transformSelection(mod, sel, 1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(7)
    )

    it('should insert inside', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 5)
      [selStart, selEnd] = editor.transformSelection(mod, sel, 1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(8)
    )

    it('should insert at selection start boundary', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 3)
      [selStart, selEnd] = editor.transformSelection(mod, sel, 1)
      expect(selStart).to.equal(4)
      expect(selEnd).to.equal(8)
    )

    it('should insert at selection end boundary', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 7)
      [selStart, selEnd] = editor.transformSelection(mod, sel, 1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(7)
    )

    it('should delete before', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 2)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -1)
      expect(selStart).to.equal(2)
      expect(selEnd).to.equal(6)
    )

    it('should delete after', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 8)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(7)
    )

    it('should delete inside', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 5)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(6)
    )

    it('should delete at selection start boundary', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 3)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(6)
    )

    it('should delete at selection end boundary', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 7)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -1)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(7)
    )

    it('should delete past selection start', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 2)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -3)
      expect(selStart).to.equal(2)
      expect(selEnd).to.equal(4)
    )

    it('should delete past selection end', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 5)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -3)
      expect(selStart).to.equal(3)
      expect(selEnd).to.equal(5)
    )

    it('should delete entire selection', ->
      editor = reset()
      sel = new Tandem.Range(editor, 3, 7)      # 012|3456|789
      mod = new Tandem.Position(editor, 2)
      [selStart, selEnd] = editor.transformSelection(mod, sel, -6)
      expect(selStart).to.equal(2)
      expect(selEnd).to.equal(2)
    )
  )


  describe('applyAttribute', ->
    originalHtml = Tandem.Utils.cleanHtml('
      <div>
        <b>123</b>
        <i>456</i>
      </div>
      <div>
        <s>7</s>
        <u>8</u>
        <s>9</s>
        <u>0</u>
      </div>
      <div>
        <b>abcdefg</b>
      </div>
    ')

    reset = (html = originalHtml) ->
      $('#editor-container').html(Tandem.Utils.cleanHtml(html))
      return new Tandem.Editor('editor-container')

    tests = [{
      target: 'single node'
      start: 8
      length: 1
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <b>
            <u>8</u>
          </b>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'multiple nodes'
      start: 8
      length: 2
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <b>
            <u>8</u>
            <s>9</s>
          </b>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'part of node'
      start: 3
      length: 2
      expected:
        '<div>
          <b>123</b>
          <b>
            <i>45</i>
          </b>
          <i>6</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'inside of node'
      start: 4
      length: 1
      expected:
        '<div>
          <b>123</b>
          <i>4</i>
          <b>
            <i>5</i>
          </b>
          <i>6</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'nodes spanning multiple lines'
      start: 3
      length: 6
      expected:
        '<div>
          <b>123</b>
          <b>
            <i>456</i>
          </b>
        </div>
        <div>
          <b>
            <s>7</s>
            <u>8</u>
          </b>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line'
      start: 7
      length: 4
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </b>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line with trailing newline'
      start: 7
      length: 5
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </b>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line with preceding newline'
      start: 6
      length: 5
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </b>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line with preceding and trailing newline'
      start: 6
      length: 6
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </b>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }]

    _.each(tests, (test) ->
      _.each({apply: true, remove: false}, (truth, name) ->
        it("should #{name} to #{test.target}", ->
          editor = reset()
          editor.applyAttribute(test.start, test.length, 'bold', truth)
          delta = editor.doc.toDelta()
          editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.expected)
          editor.doc.buildLines()
          expect(delta).to.deep.equal(editor.doc.toDelta())
        )
      )
    )
  )


  describe('insertAt', ->
    reset = ->
      $('#editor-container').html(Tandem.Utils.cleanHtml(
        '<div>
          <b>123</b>
          <i>456</i>
        </div>'
      ))
      return new Tandem.Editor('editor-container')

    tests = [{
      name: 'should insert simple text'
      index: 1
      text: 'A'
      expected: 
        '<div>
          <b>1A23</b>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert newline character'
      index: 1
      text: "\n"
      expected: 
        '<div>
          <b>1</b>
        </div>
        <div>
          <b>23</b>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert text with newline'
      index: 1
      text: "A\nB"
      expected: 
        '<div>
          <b>1A</b>
        </div>
        <div>
          <b>B23</b>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert multiple newline text'
      index: 1
      text: "A\nB\nC"
      expected: 
        '<div>
          <b>1A</b>
        </div>
        <div>
          <b>B</b>
        </div>
        <div>
          <b>C23</b>
          <i>456</i>
        </div>'
    }, {
      name: 'should add newline at boundary'
      index: 0
      text: "\n"
      expected: 
        '<div>
        </div>
        <div>
          <b>123</b>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert mutliple newline in a row text'
      index: 1
      text: "A\n\nC"
      expected: 
        '<div>
          <b>1A</b>
        </div>
        <div>
        </div>
        <div>
          <b>C23</b>
          <i>456</i>
        </div>'
    }]


    _.each(tests, (test) ->
      it(test.name, ->
        editor = reset()
        editor.insertAt(test.index, test.text)
        delta = editor.doc.toDelta()
        editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.expected)
        editor.doc.buildLines()
        expect(delta).to.deep.equal(editor.doc.toDelta())
      )
    )
  )


  describe('deleteAt', ->
    reset = ->
      $('#editor-container').html(Tandem.Utils.cleanHtml('
        <div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>
      '))
      return new Tandem.Editor('editor-container')

    it('should delete a node', ->
      editor = reset()
      editor.deleteAt(0, 3)
      expect(editor.iframeDoc.body.firstChild.textContent).to.equal('456')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(3)
    )

    _.each([0..2], (i) ->
      it('should delete part of a node ' + i, ->
        editor = reset()
        editor.deleteAt(i, 1)
        expect(editor.iframeDoc.body.firstChild.textContent).to.equal('123456'.substr(0, i) + '123456'.substr(i + 1))
        expect(editor.iframeDoc.body.childNodes.length).to.equal(3)
      )
    )

    it('should delete multiple nodes', ->
      editor = reset()
      editor.deleteAt(0, 6)
      expect(editor.iframeDoc.body.firstChild.textContent).to.equal('')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(3)
    )

    _.each([0..2], (i) ->
      it('should delete across multiple nodes ' + i, ->
        charsToDelete = 4
        editor = reset()
        editor.deleteAt(i, charsToDelete)
        expect(editor.iframeDoc.body.firstChild.textContent).to.equal('123456'.substr(0, i) + '123456'.substr(i + charsToDelete))
        expect(editor.iframeDoc.body.childNodes.length).to.equal(3)
      )
    )

    it('should delete exactly one line', ->
      editor = reset()
      editor.deleteAt(0, 7)
      expect(editor.iframeDoc.body.firstChild.textContent).to.equal('7890')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(2)
    )

    _.each([2..4], (i) ->
      it('should delete across multiple lines ' + i, ->
        charsToDelete = 6
        editor = reset()
        editor.deleteAt(i, charsToDelete)
        expect(editor.iframeDoc.body.firstChild.textContent).to.equal('1234567890'.substr(0, i) + '1234567890'.substr(i + charsToDelete - 1))
        expect(editor.iframeDoc.body.childNodes.length).to.equal(2)
      )
    )

    it('should delete a newline character', ->
      editor = reset()
      editor.deleteAt(6, 1)
      expect(editor.iframeDoc.body.childNodes.length).to.equal(2)
    )

    it('should delete entire line and more', ->
      editor = reset()
      editor.deleteAt(5, 8)
      expect(editor.iframeDoc.body.childNodes.length).to.equal(1)
    )
  )
)


