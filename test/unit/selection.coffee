describe('Selection', ->
  return unless document.getSelection

  beforeEach( ->
    @container = $('#editor-container').get(0)
  )

  describe('helpers', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div><span>0123</span></div>
          <div><br></div>
          <div><img src="http://quilljs.com/images/icon.png"></div>
          <div><b><s>89</s></b><i>ab</i></div>
        </div>
      '
      @quill = new Quill(@container.firstChild)   # Need Quill to create iframe for focus logic
      @doc = @quill.editor.doc
      @selection = @quill.editor.selection
    )

    tests =
      'text node':
        native: ->
          return [@doc.root.querySelector('s').firstChild, 1]
        encoded: ->
          return [@doc.root.querySelector('s').firstChild, 1]
        index: 9
      'between leaves':
        native: ->
          return [@doc.root.querySelector('i').firstChild, 0]
        encoded: ->
          return [@doc.root.querySelector('i').firstChild, 0]
        index: 10
      'break node':
        native: ->
          return [@doc.root.querySelector('br').parentNode, 0]
        encoded: ->
          return [@doc.root.querySelector('br'), 0]
        index: 5
      'before image':
        native: ->
          return [@doc.root.querySelector('img').parentNode, 0]
        encoded: ->
          return [@doc.root.querySelector('img'), 0]
        index: 6
      'after image':
        native: ->
          return [@doc.root.querySelector('img').parentNode, 1]
        encoded: ->
          return [@doc.root.querySelector('img'), 1]
        index: 7
      'end of document':
        native: ->
          return [@doc.root.querySelector('i').firstChild, 2]
        encoded: ->
          return [@doc.root.querySelector('i').firstChild, 2]
        index: 12

    describe('_decodePosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.encoded.call(this)
          [resultNode, resultOffset] = @selection._decodePosition(node, offset)
          [expectedNode, expectedOffset] = test.native.call(this)
          expect(resultNode).toEqual(expectedNode)
          expect(resultOffset).toEqual(expectedOffset)
        )
      )
    )

    describe('_encodePosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.native.call(this)
          [resultNode, resultOffset] = @selection._encodePosition(node, offset)
          [expectedNode, expectedOffset] = test.encoded.call(this)
          expect(resultNode).toEqual(expectedNode)
          expect(resultOffset).toEqual(expectedOffset)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        [resultNode, resultIndex] = quill.editor.selection._encodePosition(quill.editor.doc.root, 0)
        expect(resultNode).toEqual(quill.editor.doc.root)
        expect(resultIndex).toEqual(0)
      )
    )

    describe('_positionToIndex()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.native.call(this)
          index = @selection._positionToIndex(node, offset)
          expect(index).toEqual(test.index)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        index = quill.editor.selection._positionToIndex(quill.editor.doc.root, 0)
        expect(index).toEqual(0)
      )
    )

    describe('_indexToPosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = @selection._indexToPosition(test.index)
          [expectedNode, expectedOffset] = test.native.call(this)
          expect(node).toEqual(expectedNode)
          expect(offset).toEqual(expectedOffset)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        [node, offset] = quill.editor.selection._indexToPosition(0)
        expect(node).toEqual(quill.editor.doc.root)
        expect(offset).toEqual(0)
      )

      it('multiple consecutive images', ->
        @container.innerHTML = '
          <div>
            <div><img><img></div>
          </div>'
        quill = new Quill(@container.firstChild)
        [node, offset] = quill.editor.selection._indexToPosition(1)
        expect(node).toEqual(quill.editor.doc.root.firstChild)
        expect(offset).toEqual(1)
      )
    )

    describe('get/set range', ->
      _.each(tests, (test, name) ->
        it(name, ->
          @quill.focus()
          @selection.setRange(new Quill.Lib.Range(test.index, test.index))
          expect(@selection.checkFocus()).toBe(true)
          range = @selection.getRange()
          expect(range).not.toEqual(null)
          expect(range.start).toEqual(test.index)
          expect(range.end).toEqual(test.index)
        )
      )

      it('entire document', ->
        @quill.focus()
        @selection.setRange(new Quill.Lib.Range(0, 12))
        expect(@selection.checkFocus()).toBe(true)
        range = @selection.getRange()
        expect(range).not.toEqual(null)
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(12)
      )

      it('null range', ->
        @quill.focus()
        @selection.setRange(new Quill.Lib.Range(0, 0))
        expect(@selection.checkFocus()).toBe(true)
        @selection.setRange(null)
        expect(@selection.checkFocus()).toBe(false)
        range = @selection.getRange()
        expect(range).toBe(null)
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        quill = new Quill(@container.firstChild)
        quill.editor.selection.setRange(new Quill.Lib.Range(0, 0))
        expect(quill.editor.selection.checkFocus()).toBe(true)
        range = quill.editor.selection.getRange()
        expect(range).not.toEqual(null)
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(0)
      )
    )
  )

  describe('preserve', ->
    describe('shiftAfter()', ->
      it('line optimization', ->
        @container.innerHTML = '
          <div>
            <div><br></div>
            <div><span>1234</span></div>
          </div>'
        quill = new Quill(@container.firstChild)
        quill.editor.selection.setRange(new Quill.Lib.Range(0, 3))
        quill.editor._insertAt(0, '!', { image: 'http://quilljs.com/images/icon.png' })
        quill.editor._formatAt(2, 4, 'bold', true)
        expect(quill.editor.doc.root).toEqualHTML('
          <div><img src="http://quilljs.com/images/icon.png"><br></div>
          <div><b><span>1234</span></b></div>
        ', true)
        range = quill.editor.selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
        quill.editor.selection.shiftAfter(0, 0, _.bind(quill.editor.doc.optimizeLines, quill.editor.doc))
        range = quill.editor.selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )
    )

    describe('preserve()', ->
      beforeEach( ->
        @container.innerHTML = '<div></div>'
        @quill = new Quill(@container.firstChild)
        @quill.focus()
        @doc = @quill.editor.doc
        @selection = @quill.editor.selection
      )

      it('wrapInline() text', ->
        @doc.root.innerHTML = 'Test'
        textNode = @doc.root.firstChild
        @selection._setNativeRange(textNode, 0, textNode, 4)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(4)
      )

      it('wrapInline() image', ->
        @doc.root.innerHTML = '<img src="http://quilljs.com/images/icon.png">'
        @selection._setNativeRange(@doc.root, 0, @doc.root, 1)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(1)
      )

      it('handleBreaks()', ->
        @doc.root.innerHTML = '<div>01<br>34</div>'
        firstTextNode = @doc.root.firstChild.firstChild
        lastTextNode = @doc.root.firstChild.lastChild
        @selection._setNativeRange(firstTextNode, 1, lastTextNode, 1)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )

      it('pullBlocks()', ->
        @doc.root.innerHTML = '<div><div>01</div><div>34</div></div>'
        firstTextNode = @doc.root.firstChild.firstChild.firstChild
        lastTextNode = @doc.root.firstChild.lastChild.firstChild
        @selection._setNativeRange(firstTextNode, 1, lastTextNode, 1)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )

      it('wrapText()', ->
        @doc.root.innerHTML = '<div>0123</div><div>5678</div>'
        firstTextNode = @doc.root.firstChild.firstChild
        lastTextNode = @doc.root.lastChild.firstChild
        @selection._setNativeRange(firstTextNode, 2, lastTextNode, 2)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(2)
        expect(range.end).toEqual(7)
      )

      it('no range', ->
        @doc.root.innerHTML = '<div><span>Test</span></div>'
        textNode = @doc.root.querySelector('span').firstChild
        @selection._setNativeRange(null)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range).toBe(null)
      )
    )
  )
)
