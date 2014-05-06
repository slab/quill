describe('Keyboard', ->
  beforeEach( ->
    @container = $('#editor-container').get(0)
  )

  describe('toggleFormat()', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <p><s>01</s><b>23</b>45</p>
        </div>'
      @quill = new Quill(@container.firstChild)
      @keyboard = @quill.getModule('keyboard')
    )

    it('set if all unset', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(3, 6), 'strike')
      expect(@quill.root.firstChild).toEqualHTML('<s>01</s><b>2<s>3</s></b><s>45</s>')
    )

    it('unset if all set', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(2, 4), 'bold')
      expect(@quill.root.firstChild).toEqualHTML('<s>01</s>2345')
    )

    it('set if partially set', ->
      @keyboard.toggleFormat(new Quill.Lib.Range(3, 5), 'bold')
      expect(@quill.root.firstChild).toEqualHTML('<s>01</s><b>234</b>5')
    )
  )

  describe('hotkeys', ->
    beforeEach( ->
      @container.innerHTML = '<div><p>0123</p></div>'
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
      Quill.DOM.triggerEvent(@quill.root, 'keydown', hotkey)
    )

    it('format', ->
      @quill.setSelection(0, 4)
      Quill.DOM.triggerEvent(@quill.root, 'keydown', Quill.Module.Keyboard.hotkeys.BOLD)
      expect(@quill.root).toEqualHTML('<p><b>0123</b></p>', true)
    )

    it('tab', ->
      @quill.setSelection(1, 3)
      Quill.DOM.triggerEvent(@quill.root, 'keydown', Quill.Module.Keyboard.hotkeys.INDENT)
      expect(@quill.root).toEqualHTML('<p>0\t3</p>', true)
    )

    it('shift + tab', ->
      @quill.setSelection(0, 2)
      Quill.DOM.triggerEvent(@quill.root, 'keydown', Quill.Module.Keyboard.hotkeys.OUTDENT)
      expect(@quill.root).toEqualHTML('<p>0123</p>', true)
    )
  )
)
