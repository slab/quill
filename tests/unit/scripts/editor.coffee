#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Editor', ->
  describe('transformSelection', ->
    reset = ->
      $('#editor-container').html('<div class="line"><b>01234567890</b></div>')
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


  #describe('applyAttribute', ->
  #  it('should apply attribute to single node')

  #  it('should wrap multiple nodes')

  #  it('should apply to part of node')

  #  it('should apply to nodes spanning multiple lines')


  #)


  describe('insertAt', ->
    reset = ->
      $('#editor-container').html('<div class="line"><b>123</b><i>456</i></div>')
      return new Tandem.Editor('editor-container')
      
    it('should insert simple text', ->
      editor = reset()
      editor.insertAt(1, 'A')
      expect(editor.iframeDoc.body.firstChild.textContent).to.equal('1A23456')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(1)
    )

    it('should insert newline character', ->
      editor = reset()
      editor.insertAt(1, "\n")
      expect(editor.iframeDoc.body.innerHTML).to.equal('<div class="line"><b>1</b></div><div class="line"><b>23</b><i>456</i></div>')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(2)
    )

    it('should insert text with newline', ->
      editor = reset()
      editor.insertAt(1, "A\nB")
      expect(editor.iframeDoc.body.innerHTML).to.equal('<div class="line"><b>1A</b></div><div class="line"><b>B23</b><i>456</i></div>')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(2)
    )

    it('should insert multiple newline text', ->
      editor = reset()
      editor.insertAt(1, "A\nB\nC")
      expect(editor.iframeDoc.body.innerHTML).to.equal('<div class="line"><b>1A</b></div><div class="line"><b>B</b></div><div class="line"><b>C23</b><i>456</i></div>')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(3)
    )

    ###
    it('should insert mutliple newline in a row text', ->
      editor = reset()
      editor.insertAt(1, "A\n\nC")
      expect(editor.iframeDoc.body.innerHTML).to.equal('<div class="line"><b>1A</></div><div class="line"><b></b></div><div class="line"><b>C23</b><i>456</i></div>')
      expect(editor.iframeDoc.body.childNodes.length).to.equal(3)
    )
    ###
  )


  describe('deleteAt', ->
    reset = ->
      $('#editor-container').html('<div class="line"><b>123</b><i>456</i></div><div class="line"><s>7</s><u>8</u><s>9</s><u>0</u></div><div class="line"><b>abcdefg</b></div>')
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


