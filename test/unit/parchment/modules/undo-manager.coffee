Delta = require('rich-text/lib/delta')
Quill = require('../../../../src/quill')
require('../../../../src/modules/undo-manager')

describe('UndoManager', ->
  beforeEach( ->
    @container.innerHTML = '\
      <div>\
        <p>The lazy fox</p>\
      </div>'
    @quill = new Quill(@container.firstChild, {
      modules: {
        'undo-manager': { delay: 400 }
      }
    })
    window.quill = @quill
    @undoManager = @quill.getModule('undo-manager')
    @original = @quill.getContents()
  )

  # tests =
  #   'insert':
  #     delta: new Delta().retain(9).insert('hairy ')
  #     index: 15
  #   'delete':
  #     delta: new Delta().retain(4).delete(5)
  #     index: 4
  #   'format':
  #     delta: new Delta().retain(4).retain(5, { bold: true })
  #     index: 9
  #   'multiple':
  #     delta: new Delta().retain(4, { bold: true }).insert('hairy').delete(4)
  #     index: 9

  # describe('_getLastChangeIndex', ->
  #   _.each(tests, (test, name) ->
  #     it(name, ->
  #       index = @undoManager._getLastChangeIndex(test.delta)
  #       expect(index).toEqual(test.index)
  #     )
  #   )
  # )

  describe('undo/redo', ->
    # _.each(tests, (test, name) ->
    #   it(name, ->
    #     @quill.updateContents(test.delta)
    #     changed = @quill.getContents()
    #     expect(changed).not.toEqualDelta(@original)
    #     @undoManager.undo()
    #     expect(@quill.getContents()).toEqualDelta(@original)
    #     @undoManager.redo()
    #     expect(@quill.getContents()).toEqualDelta(changed)
    #   )
    # )

    it('user change', ->
      @quill.root.firstChild.innerHTML = 'The lazy foxes'
      @quill.update()
      changed = @quill.getContents()
      expect(changed).not.toEqualDelta(@original)
      @undoManager.undo()
      expect(@quill.getContents()).toEqualDelta(@original)
      @undoManager.redo()
      expect(@quill.getContents()).toEqualDelta(changed)
    )

    it('merge changes', ->
      expect(@undoManager.stack.undo.length).toEqual(0)
      @quill.updateContents(new Delta().retain(12).insert('e'))
      expect(@undoManager.stack.undo.length).toEqual(1)
      @quill.updateContents(new Delta().retain(13).insert('s'))
      expect(@undoManager.stack.undo.length).toEqual(1)
      @undoManager.undo()
      expect(@quill.getContents()).toEqual(@original)
      expect(@undoManager.stack.undo.length).toEqual(0)
    )

    it('dont merge changes', (done) ->
      expect(@undoManager.stack.undo.length).toEqual(0)
      @quill.updateContents(new Delta().retain(12).insert('e'))
      expect(@undoManager.stack.undo.length).toEqual(1)
      setTimeout( =>
        @quill.updateContents(new Delta().retain(13).insert('s'))
        expect(@undoManager.stack.undo.length).toEqual(2)
        done()
      , @undoManager.options.delay * 1.25)
    )

    it('multiple undos', (done) ->
      expect(@undoManager.stack.undo.length).toEqual(0)
      @quill.updateContents(new Delta().retain(12).insert('e'))
      contents = @quill.getContents()
      setTimeout( =>
        @quill.updateContents(new Delta().retain(13).insert('s'))
        @undoManager.undo()
        expect(@quill.getContents()).toEqual(contents)
        @undoManager.undo()
        expect(@quill.getContents()).toEqual(@original)
        done()
      , @undoManager.options.delay * 1.25)
    )

    it('api change transform', ->
      @quill.getModule('undo-manager').options.userOnly = true
      @quill.updateContents(new Delta().retain(12).insert('es'), Quill.sources.USER)
      @quill.updateContents(new Delta().retain(4).delete(5), Quill.sources.API)
      @quill.updateContents(new Delta().retain(9).insert('!'), Quill.sources.USER)
      expect(@undoManager.stack.undo.length).toEqual(1)
      expect(@quill.getContents()).toEqual(new Delta().insert('The foxes!\n'))
      @undoManager.undo()
      expect(@quill.getContents()).toEqual(new Delta().insert('The fox\n'))
      @undoManager.redo()
      expect(@quill.getContents()).toEqual(new Delta().insert('The foxes!\n'))
    )
  )
)
