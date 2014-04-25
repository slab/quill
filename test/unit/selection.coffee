describe('Selection', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )

  it('constructor', -> )
  it('checkFocus', -> )
  it('getRange', -> )
  it('preserve', -> )
  it('setRange', -> )
  it('shiftAfter', -> )
  it('update', -> )
  it('_getNativeRange', -> )
  it('_setNativeRange', -> )


  describe('helpers', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div><span>0123</span></div>
          <div><br></div>
          <div><img></div>
          <div><b><s>89</s></b><i>ab</i></div>
        </div>
      '
      @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
      @emitter = new Quill.Lib.EventEmitter2
      @selection = new Quill.Selection(@doc, @emitter)
    )

    tests =
      'text node':
        native: ->
          return [@doc.root.querySelector('s').firstChild, 1]
        normalized: ->
          return [@doc.root.querySelector('s').firstChild, 1]
        index: 9
      'between leaves':
        native: ->
          return [@doc.root.querySelector('i').firstChild, 0]
        normalized: ->
          return [@doc.root.querySelector('i').firstChild, 0]
        index: 10
      'break node':
        native: ->
          return [@doc.root.querySelector('br').parentNode, 0]
        normalized: ->
          return [@doc.root.querySelector('br'), 0]
        index: 5
      'before image':
        native: ->
          return [@doc.root.querySelector('img').parentNode, 0]
        normalized: ->
          return [@doc.root.querySelector('img'), 0]
        index: 6
      'after image':
        native: ->
          return [@doc.root.querySelector('img').parentNode, 1]
        normalized: ->
          return [@doc.root.querySelector('img'), 1]
        index: 7
      'end of document':
        native: ->
          return [@doc.root.querySelector('i').firstChild, 2]
        normalized: ->
          return [@doc.root.querySelector('i').firstChild, 2]
        index: 12


    describe('_normalizePosition()', ->
      _.each(tests, (test, name) ->
        it(name, ->
          [node, offset] = test.native.call(this)
          [resultNode, resultOffset] = @selection._normalizePosition(node, offset)
          [expectedNode, expectedOffset] = test.normalized.call(this)
          expect(resultNode).toEqual(expectedNode)
          expect(resultOffset).toEqual(expectedOffset)
        )
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        @selection = new Quill.Selection(@doc, @emitter)
        [resultNode, resultIndex] = @selection._normalizePosition(@doc.root, 0)
        expect(resultNode).toEqual(@doc.root)
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
        @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        @selection = new Quill.Selection(@doc, @emitter)
        index = @selection._positionToIndex(@doc.root, 0)
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
        @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        @selection = new Quill.Selection(@doc, @emitter)
        [node, offset] = @selection._indexToPosition(0)
        expect(node).toEqual(@doc.root)
        expect(offset).toEqual(0)
      )
    )
  )

  # Set range, get range, see if its the same

  # Shift after
  # Preserve
    # We modify dat DOM
)
