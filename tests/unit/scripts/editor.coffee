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
      editor = new Tandem.Editor('editor-container')
      editor.ignoreDomChanges = true
      return editor

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
        return if truth == true
        it("should #{name} to #{test.target}", ->
          [startHtml, endHtml] = if truth then [originalHtml, test.expected] else [test.expected, originalHtml]
          editor = reset(startHtml)
          editor.applyAttribute(test.start, test.length, 'bold', truth)
          delta = editor.doc.toDelta()
          editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(endHtml)
          editor.doc.buildLines()
          expect(delta).to.deep.equal(editor.doc.toDelta())
          expect(editor.doc.checkConsistency(true)).to.be.true
        )
      )
    )
  )



  describe('insertAt', ->
    reset = ->
      $('#editor-container').html(Tandem.Utils.cleanHtml(
        '<div>
          <span>123</span>
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
          <span>1A23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert text inside formatted tags'
      index: 4
      text: 'A'
      expected: 
        '<div>
          <span>123</span>
          <i>4</i>
          <span>A</span>
          <i>56</i>
        </div>'
    }, {
      name: 'should insert newline character'
      index: 1
      text: "\n"
      expected: 
        '<div>
          <span>1</span>
        </div>
        <div>
          <span>23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert text with newline'
      index: 1
      text: "A\nB"
      expected: 
        '<div>
          <span>1A</span>
        </div>
        <div>
          <span>B23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert multiple newline text'
      index: 1
      text: "A\nB\nC"
      expected: 
        '<div>
          <span>1A</span>
        </div>
        <div>
          <span>B</span>
        </div>
        <div>
          <span>C23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should add newline at boundary'
      index: 0
      text: "\n"
      expected: 
        '<div>
          <br>
        </div>
        <div>
          <span>123</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert mutliple newline in a row text'
      index: 1
      text: "A\n\nC"
      expected: 
        '<div>
          <span>1A</span>
        </div>
        <div>
          <br>
        </div>
        <div>
          <span>C23</span>
          <i>456</i>
        </div>'
    }]
    tests = [tests[5]]

    _.each(tests, (test) ->
      it(test.name, ->
        editor = reset()
        editor.insertAt(test.index, test.text)
        expect(editor.doc.checkConsistency(true)).to.be.true
        delta = editor.doc.toDelta()
        editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.expected)
        editor.doc.buildLines()
        expect(editor.doc.toDelta()).to.deep.equal(delta)
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

    tests = [{
      name: 'a node'
      start: 0
      length: 3
      expected:
        '<div>
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
        </div>'
    }, {
      name: 'part of a node'
      start: [0..2]
      length: 1
      expected: (index) ->
        char = (index + 1).toString()
        html = "
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
          </div>"
        return html.replace(char.toString(), '')
    }, {
      name: 'multiple nodes'
      start: 0
      length: 6
      expected:
        '<div>
          <br>
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
      name: 'across multiple nodes'
      start: [0..2]
      length: 4
      expected: (index) ->
        fragments = [
          "<div><i>56</i></div>"
          "<div><b>1</b><i>6</i></div>"
          "<div><b>12</b></div>"
        ]
        return fragments[index] + "
          <div>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </div>
          <div>
            <b>abcdefg</b>
          </div>"
    }, {
      name: 'the first line'
      start: 0
      length: 7
      expected:
        '<div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'the last line'
      start: 11
      length: 8
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>'
    }, {
      name: 'a middle line + newline'
      start: 7
      length: 5
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'newline + next line'
      start: 6
      length: 5
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'a newline character'
      start: 6
      length: 1
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'entire line and more'
      start: 5
      length: 8
      expected:
        '<div>
          <b>123</b>
          <i>45</i>
          <b>bcdefg</b>
        </div>'
    }, {
      name: 'across multiple lines'
      start: [2..4]
      length: 6
      expected: (index) ->
        fragments = [
          '<div><b>12</b><u>8</u><s>9</s><u>0</u></div>'
          '<div><b>123</b><s>9</s><u>0</u></div>'
          '<div><b>123</b><i>4</i><u>0</u></div>'
        ]
        return fragments[index] + '
          <div>
            <b>abcdefg</b>
          </div>'
    }]


    _.each(tests, (test) ->
      starts = if _.isNumber(test.start) then [test.start] else test.start
      _.each(starts, (start, index) ->
        name = 'should delete ' + test.name
        name += ' ' + index if starts.length > 1
        it(name, ->
          editor = reset()
          editor.deleteAt(start, test.length)
          expect(editor.doc.checkConsistency(true)).to.be.true
          delta = editor.doc.toDelta()
          if _.isString(test.expected)
            expected = test.expected
          else if _.isArray(test.expected)
            expected = test[index]
          else
            expected = test.expected(index)
          editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(expected)
          editor.doc.buildLines()
          expect(editor.doc.toDelta()).to.deep.equal(delta)
        )
      )
    )
  )
)


