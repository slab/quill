describe('Keyboard', ->
  beforeEach( ->
    @container = $('#editor-container').get(0)
  )

  describe('toggleFormat()', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div><s>01</s><b>23</b><span>45</span></div>
        </div>'
      @quill = new Quill(@container.firstChild)
      @keyboard = @quill.getModule('keyboard')
    )

    it('set if all unset', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(3, 6), 'strike')
      expect(@quill.editor.root.firstChild).toEqualHTML('<s>01</s><b>2</b><s><b>3</b><span>45</span></s>')
    )

    it('unset if all set', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(2, 4), 'bold')
      expect(@quill.editor.root.firstChild).toEqualHTML('<s>01</s><span>2345</span>')
    )

    it('set if partially set', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(3, 5), 'bold')
      expect(@quill.editor.root.firstChild).toEqualHTML('<s>01</s><b>234</b><span>5</span>')
    )
  )

  describe('hotkeys', ->
    beforeEach( ->
      @container.innerHTML = '<div><div><span>0123</span></div></div>'
      @quill = new Quill(@container.firstChild)
      @keyboard = @quill.getModule('keyboard')
    )

    it('trigger', (done) ->
      hotkey = { key: 'B', metaKey: true }
      @keyboard.addHotkey(hotkey, (range) ->
        expect(range.start).toEqual(1)
        expect(range.end).toEqual(2)
        done()
      )
      @quill.setSelection(1, 2)
      Quill.DOM.triggerEvent(@quill.editor.root, 'keydown', hotkey)
    )

    it('format', ->
      @quill.setSelection(0, 4)
      Quill.DOM.triggerEvent(@quill.editor.root, 'keydown', Quill.Module.Keyboard.hotkeys.BOLD)
      expect(@quill.editor.root).toEqualHTML('<div><b>0123</b></div>', true)
    )

    it('tab', ->
      @quill.setSelection(1, 3)
      Quill.DOM.triggerEvent(@quill.editor.root, 'keydown', Quill.Module.Keyboard.hotkeys.INDENT)
      expect(@quill.editor.root).toEqualHTML('<div><span>0\t3</span></div>', true)
    )

    it('shift + tab', ->
      @quill.setSelection(0, 2)
      Quill.DOM.triggerEvent(@quill.editor.root, 'keydown', Quill.Module.Keyboard.hotkeys.OUTDENT)
      expect(@quill.editor.root).toEqualHTML('<div><span>0123</span></div>', true)
    )
  )
)
