dom = Quill.Lib.DOM

describe('Keyboard', ->
  beforeEach( ->
    @container = $('#editor-container').get(0)
  )

  describe('toggleFormat()', ->
    beforeEach( ->
      @container.innerHTML = '
        <div>
          <div><s>01</s><b>23</b>45</div>
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
      @container.innerHTML = '<div><div>0123</div></div>'
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
      dom(@quill.root).trigger('keydown', hotkey)
    )

    it('format', ->
      @quill.setSelection(0, 4)
      dom(@quill.root).trigger('keydown', Quill.Module.Keyboard.hotkeys.BOLD)
      expect(@quill.root).toEqualHTML('<div><b>0123</b></div>', true)
    )

    it('tab', ->
      @quill.setSelection(1, 3)
      dom(@quill.root).trigger('keydown', Quill.Module.Keyboard.hotkeys.INDENT)
      expect(@quill.root).toEqualHTML('<div>0\t3</div>', true)
    )

    it('shift + tab', ->
      @quill.setSelection(0, 2)
      dom(@quill.root).trigger('keydown', Quill.Module.Keyboard.hotkeys.OUTDENT)
      expect(@quill.root).toEqualHTML('<div>0123</div>', true)
    )

    it('retain formatting', ->
      @quill.addModule('toolbar', { container: $('#toolbar-container').get(0) })
      size = '18px'

      @quill.setText('foo bar baz')
      @quill.formatText(0, @quill.getLength(), { 'bold': true, 'size': size })

      @quill.setSelection(@quill.getLength(), @quill.getLength())
      dom(@quill.root).trigger('keydown', { key: dom.KEYS.ENTER })

      expect(dom($('.ql-bold').get(0)).hasClass('ql-active')).toBe(true)
      expect(dom($('.ql-size').get(0)).value()).toBe(size)
    )

    it('removeHotkeys by name', ->
      counter = 0
      fn = -> counter += 1
      keyboard = @quill.getModule('keyboard')
      keyboard.addHotkey('S', fn)
      dom(@quill.root).trigger('keydown', { key: 'S' })
      expect(counter).toBe(1)
      result = keyboard.removeHotkeys('S', fn)
      expect(result.length).toBe(1)
      expect(result[0]).toBe(fn);
      dom(@quill.root).trigger('keydown', { key: 'S' })
      expect(counter).toBe(1)
    )

    it('removeHotkeys by object', ->
      counter = 0
      fn = -> counter += 1
      keyboard = @quill.getModule('keyboard')
      keyboard.addHotkey({ key: 'S', metaKey: true }, fn)
      dom(@quill.root).trigger('keydown', { key: 'S', metaKey: true })
      result = keyboard.removeHotkeys({ key: 'S', metaKey: true })
      expect(result.length).toBe(1)
      expect(result[0]).toBe(fn)
      dom(@quill.root).trigger('keydown', { key: 'S', metaKey: true })
      expect(counter).toBe(1)
    )

    it('removeHotKeys only the specified callback', ->
      fn = ->
      anotherFn = ->
      keyboard = @quill.getModule('keyboard')
      keyboard.addHotkey({ key: 'S', metaKey: true }, fn)
      keyboard.addHotkey({ key: 'S', metaKey: true }, anotherFn)
      result = keyboard.removeHotkeys({ key: 'S', metaKey: true }, fn)
      expect(result.length).toBe(1)
      expect(result[0]).toBe(fn)
    )
  )
)
