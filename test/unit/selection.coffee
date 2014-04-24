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
          <div><b><s>67</s></b><i>89</i></div>
        </div>
      '
      @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
      @emitter = new Quill.Lib.EventEmitter2
      @selection = new Quill.Selection(@doc, @emitter)
    )

    describe('_normalizePosition()', ->
      it('text node', ->
        node = @doc.root.querySelector('span').firstChild
        [resultNode, resultIndex] = @selection._normalizePosition(node, 2)
        expect(resultNode).toEqual(node)
        expect(resultIndex).toEqual(2)
      )

      it('leaf node', ->
        node = @doc.root.querySelector('span')
        [resultNode, resultIndex] = @selection._normalizePosition(node, 0)
        expect(resultNode).toEqual(node.firstChild)
        expect(resultIndex).toEqual(0)
      )

      it('line node', ->
        node = @doc.root.lastChild
        [resultNode, resultIndex] = @selection._normalizePosition(node, 1)
        expect(resultNode).toEqual(node.querySelector('i').firstChild)
        expect(resultIndex).toEqual(0)
      )

      it('break node', ->
        node = @doc.root.querySelector('br')
        [resultNode, resultIndex] = @selection._normalizePosition(node, 0)
        expect(resultNode).toEqual(node)
        expect(resultIndex).toEqual(0)
      )

      it('image node', ->
        node = @doc.root.querySelector('img')
        [resultNode, resultIndex] = @selection._normalizePosition(node, 0)
        expect(resultNode).toEqual(node)
        expect(resultIndex).toEqual(0)
      )

      it('document root', ->
        node = @doc.root
        [resultNode, resultIndex] = @selection._normalizePosition(node, 0)
        expect(resultNode).toEqual(@doc.root.querySelector('span').firstChild)
        expect(resultIndex).toEqual(0)
      )

      it('empty document', ->
        @container.innerHTML = '<div></div>'
        @doc = new Quill.Document(@container.firstChild, { formats: Quill.DEFAULTS.formats })
        @emitter = new Quill.Lib.EventEmitter2
        @selection = new Quill.Selection(@doc, @emitter)
        node = @doc.root
        [resultNode, resultIndex] = @selection._normalizePosition(node, 0)
        expect(resultNode).toEqual(@doc.root)
        expect(resultIndex).toEqual(0)
      )
    )

    describe('_indexToPosition', ->
      # end of line (on trailing newline)
      # end of document (on trailing newline)
      # 0 on empty document
      # on break tag
    )

    describe('_positionToIndex', ->

    )
  )

  # Normalizing position

  # Converting positionToIndex
  # Converting indexToPosition

  # Set range, get range, see if its the same

  # Shift after
  # Preserve
    # We modify dat DOM
)
