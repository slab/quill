describe('Selection', ->
  beforeEach( ->
    @container = $('#editor-container').get(0)
  )

  describe('helpers', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div>0123</div>
          <div><br></div>
          <div><img src="http://quilljs.com/images/cloud.png"></div>
          <ul>
            <li>One</li>
            <li>Two</li>
          </ul>
          <div><b><s>89</s></b><i>ab</i></div>
        </div>
      '
      @quill = new Quill(@container.firstChild)   # Need Quill to create iframe for focus logic
      @selection = @quill.editor.selection
    )

    tests =
      'text node':
        native: ->
          return [@quill.root.querySelector('s').firstChild, 1]
        encoded: ->
          return [@quill.root.querySelector('s').firstChild, 1]
        index: 17
      'between leaves':
        native: ->
          return [@quill.root.querySelector('s').firstChild, 2]
        encoded: ->
          return [@quill.root.querySelector('s').firstChild, 2]
        index: 18
      'break node':
        native: ->
          return [@quill.root.querySelector('br').parentNode, 0]
        encoded: ->
          return [@quill.root.querySelector('br'), 0]
        index: 5
      'before image':
        native: ->
          return [@quill.root.querySelector('img').parentNode, 0]
        encoded: ->
          return [@quill.root.querySelector('img'), 0]
        index: 6
      'after image':
        native: ->
          return [@quill.root.querySelector('img').parentNode, 1]
        encoded: ->
          return [@quill.root.querySelector('img'), 1]
        index: 7
      'bullet':
        native: ->
          return [@quill.root.querySelectorAll('li')[1].firstChild, 1]
        encoded: ->
          return [@quill.root.querySelectorAll('li')[1].firstChild, 1]
        index: 13
      'last node':
        native: ->
          return [@quill.root.querySelector('i').firstChild, 2]
        encoded: ->
          return [@quill.root.querySelector('i').firstChild, 2]
        index: 20

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
        quill.root.innerHTML = ''
        quill.editor.doc.rebuild()
        [resultNode, resultIndex] = quill.editor.selection._encodePosition(quill.root, 0)
        expect(resultNode).toEqual(quill.root)
        expect(resultIndex).toEqual(0)
      )

      it('end of document', ->
        [resultNode, resultOffset] = @selection._encodePosition(@quill.root, 5)
        expect(resultNode).toEqual(@quill.root.querySelector('i').firstChild)
        expect(resultOffset).toEqual(2)
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
        index = quill.editor.selection._positionToIndex(quill.root, 0)
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
        quill.root.innerHTML = ''
        quill.editor.doc.rebuild()
        [node, offset] = quill.editor.selection._indexToPosition(0)
        expect(node).toEqual(quill.root)
        expect(offset).toEqual(0)
      )

      it('multiple consecutive images', ->
        @container.innerHTML = '
          <div>
            <div><img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png"></div>
          </div>'
        quill = new Quill(@container.firstChild)
        [node, offset] = quill.editor.selection._indexToPosition(1)
        expect(node).toEqual(quill.root.firstChild)
        expect(offset).toEqual(1)
      )
    )

    describe('get/set range', ->
      _.each(tests, (test, name) ->
        it(name, ->
          @selection.setRange(new Quill.Lib.Range(test.index, test.index))
          expect(@selection.checkFocus()).toBe(true)
          range = @selection.getRange()
          expect(range).not.toEqual(null)
          expect(range.start).toEqual(test.index)
          expect(range.end).toEqual(test.index)
        )
      )

      it('entire document', ->
        @selection.setRange(new Quill.Lib.Range(0, 20))
        expect(@selection.checkFocus()).toBe(true)
        range = @selection.getRange()
        expect(range).not.toEqual(null)
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(20)
      )

      it('null range', ->
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
            <div>1234</div>
          </div>'
        quill = new Quill(@container.firstChild)
        quill.editor.selection.setRange(new Quill.Lib.Range(0, 3))
        quill.editor._insertAt(0, Quill.DOM.EMBED_TEXT, { image: 'http://quilljs.com/images/cloud.png' })
        quill.editor._formatAt(2, 4, 'bold', true)
        expect(quill.root).toEqualHTML('
          <div><img src="http://quilljs.com/images/cloud.png"><br></div>
          <div><b>1234</b></div>
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
        @doc = @quill.editor.doc
        @selection = @quill.editor.selection
      )

      it('wrapInline() text', ->
        @quill.root.innerHTML = 'Test'
        textNode = @quill.root.firstChild
        @selection._setNativeRange(textNode, 0, textNode, 4)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(4)
      )

      it('wrapInline() image', ->
        @quill.root.innerHTML = '<img src="http://quilljs.com/images/cloud.png">'
        @selection._setNativeRange(@quill.root, 0, @quill.root, 1)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(0)
        expect(range.end).toEqual(1)
      )

      it('handleBreaks()', ->
        @quill.root.innerHTML = '<div>01<br>34</div>'
        firstTextNode = @quill.root.firstChild.firstChild
        lastTextNode = @quill.root.firstChild.lastChild
        @selection._setNativeRange(firstTextNode, 1, lastTextNode, 1)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )

      it('pullBlocks()', ->
        @quill.root.innerHTML = '<div><div>01</div><div>34</div></div>'
        firstTextNode = @quill.root.firstChild.firstChild.firstChild
        lastTextNode = @quill.root.firstChild.lastChild.firstChild
        @selection._setNativeRange(firstTextNode, 1, lastTextNode, 1)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(4)
      )

      it('wrapText()', ->
        @quill.root.innerHTML = '<div>0123</div><div>5678</div>'
        firstTextNode = @quill.root.firstChild.firstChild
        lastTextNode = @quill.root.lastChild.firstChild
        @selection._setNativeRange(firstTextNode, 2, lastTextNode, 2)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range.start).toEqual(2)
        expect(range.end).toEqual(7)
      )

      it('no range', ->
        @quill.root.innerHTML = '<div>Test</div>'
        textNode = @quill.root.querySelector('div').firstChild
        @selection._setNativeRange(null)
        @selection.preserve(_.bind(@doc.rebuild, @doc))
        range = @selection.getRange()
        expect(range).toBe(null)
      )
    )
  )
)
