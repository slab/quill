describe('UndoManager', ->
  beforeEach( ->
    @container = $('#editor-container').get(0)
    @container.innerHTML = '
      <div>
        <div><span>The lazy fox</span></div>
      </div>'
    @quill = new Quill(@container.firstChild, {
      modules: {
        'undo-manager': { delay: 10 }
      }
    })
    @undoManager = @quill.getModule('undo-manager')
    @original = @quill.getContents()
  )

  tests =
    'insert':
      delta: Tandem.Delta.makeInsertDelta(13, 9, 'hairy ')
      index: 15
    'delete':
      delta: Tandem.Delta.makeDeleteDelta(13, 4, 5)
      index: 4
    'format':
      delta: Tandem.Delta.makeRetainDelta(13, 4, 5, { bold: true })
      index: 9
    'multiple':
      delta: Tandem.Delta.makeDelta({
        startLength: 13
        endLength: 14
        ops: [
          { start: 0, end: 4, attributes: { bold: true } }
          { value: 'hairy' }
          { start: 8, end: 13 }
        ]
      })
      index: 9

  describe('_getLastChangeIndex', ->
    _.each(tests, (test, name) ->
      it(name, ->
        index = @undoManager._getLastChangeIndex(test.delta)
        expect(index).toEqual(test.index)
      )
    )
  )

  describe('undo/redo', ->
    _.each(tests, (test, name) ->
      it(name, ->
        @quill.updateContents(test.delta)
        changed = @quill.getContents()
        expect(changed).not.toEqualDelta(@original)
        @undoManager.undo()
        expect(@quill.getContents()).toEqualDelta(@original)
        @undoManager.redo()
        expect(@quill.getContents()).toEqualDelta(changed)
      )
    )

    it('user change', ->
      @quill.root.firstChild.innerHTML = '<span>The lazy foxes</span>'
      @quill.editor.checkUpdate()
      changed = @quill.getContents()
      expect(changed).not.toEqualDelta(@original)
      @undoManager.undo()
      expect(@quill.getContents()).toEqualDelta(@original)
      @undoManager.redo()
      expect(@quill.getContents()).toEqualDelta(changed)
    )

    it('merge changes', ->
      expect(@undoManager.stack.undo.length).toEqual(0)
      @quill.updateContents(Tandem.Delta.makeInsertDelta(13, 12, 'e'))
      expect(@undoManager.stack.undo.length).toEqual(1)
      @quill.updateContents(Tandem.Delta.makeInsertDelta(14, 13, 's'))
      expect(@undoManager.stack.undo.length).toEqual(1)
      @undoManager.undo()
      expect(@quill.getContents()).toEqual(@original)
      expect(@undoManager.stack.undo.length).toEqual(0)
    )

    it('dont merge changes', (done) ->
      expect(@undoManager.stack.undo.length).toEqual(0)
      @quill.updateContents(Tandem.Delta.makeInsertDelta(13, 12, 'e'))
      expect(@undoManager.stack.undo.length).toEqual(1)
      setTimeout( =>
        @quill.updateContents(Tandem.Delta.makeInsertDelta(14, 13, 's'))
        expect(@undoManager.stack.undo.length).toEqual(2)
        done()
      , @undoManager.options.delay * 1.25)
    )

    it('hotkeys', ->
      @quill.updateContents(Tandem.Delta.makeInsertDelta(13, 0, 'A '))
      changed = @quill.getContents()
      expect(changed).not.toEqualDelta(@original)
      Quill.DOM.triggerEvent(@quill.root, 'keydown', Quill.Module.UndoManager.hotkeys.UNDO)
      expect(@quill.getContents()).toEqualDelta(@original)
      Quill.DOM.triggerEvent(@quill.root, 'keydown', Quill.Module.UndoManager.hotkeys.REDO)
      expect(@quill.getContents()).toEqualDelta(changed)
    )
  )
)
