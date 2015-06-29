describe('Quill', ->
  beforeEach( ->
    jasmine.resetEditor()
    @container = $('#editor-container').html('
      <div>
        <div>0123</div>
        <div>5678</div>
      </div>
    ').get(0)
    @quill = new Quill(@container.firstChild)
  )

  describe('constructor', ->
    it('string container', ->
      @container.innerHTML = '<div id="target"></div>'
      quill = new Quill('#target')
      expect(quill.container).toEqual(@container.firstChild)
    )

    it('invalid container', ->
      expect( =>
        @quill = new Quill('.none')
      ).toThrow(new Error('Invalid Quill container'))
    )
  )

  describe('modules', ->
    it('addContainer()', ->
      @quill.addContainer('test-container', true)
      expect(@quill.container.querySelector('.test-container')).toEqual(@quill.container.firstChild)
    )

    it('addModule()', ->
      obj =
        before: ->
        after: ->
      spyOn(obj, 'before')
      spyOn(obj, 'after')
      expect(@quill.getModule('toolbar')).toBe(undefined)
      @quill.onModuleLoad('toolbar', obj.before)
      @quill.addModule('toolbar', { container: '#toolbar-container' })
      expect(@quill.getModule('toolbar')).not.toBe(null)
      expect(obj.before).toHaveBeenCalled()
      @quill.onModuleLoad('toolbar', obj.after)
      expect(obj.after).toHaveBeenCalled()
    )

    it('addModule() nonexistent', ->
      expect( =>
        @quill.addModule('nonexistent')
      ).toThrow(new Error("Cannot load nonexistent module. Are you sure you registered it?"))
    )
  )

  describe('manipulation', ->
    it('deleteText()', ->
      @quill.deleteText(2, 3)
      expect(@quill.root).toEqualHTML('<div>013</div><div>5678</div>', true)
    )

    it('formatLine()', ->
      @quill.formatLine(4, 6, 'align', 'right')
      expect(@quill.root).toEqualHTML('
        <div style="text-align: right;">0123</div>
        <div style="text-align: right;">5678</div>
      ', true)
    )

    it('formatText()', ->
      @quill.formatText(2, 4, 'bold', true)
      expect(@quill.root).toEqualHTML('<div>01<b>23</b></div><div>5678</div>', true)
      @quill.formatText(2, 4, 'bold', false)
      expect(@quill.root).toEqualHTML('<div>0123</div><div>5678</div>', true)
      expect(@quill.getContents(0, 4)).toEqualDelta(new Quill.Delta().insert('0123'))
    )

    it('formatText() default style', ->
      html = @quill.root.innerHTML
      @quill.formatText(2, 4, 'size', '13px')
      expect(@quill.root).toEqualHTML(html)
    )

    it('insertEmbed()', ->
      @quill.insertEmbed(2, 'image', 'http://quilljs.com/images/cloud.png')
      expect(@quill.root).toEqualHTML('<div>01<img src="http://quilljs.com/images/cloud.png">23</div><div>5678</div>', true)
    )

    it('insertText()', ->
      @quill.insertText(2, 'A')
      expect(@quill.root).toEqualHTML('<div>01A23</div><div>5678</div>', true)
    )

    it('setContents() with delta', ->
      delta = {
        ops: [{ insert: 'A', attributes: { bold: true } }]
      }
      @quill.setContents(delta)
      expect(@quill.root).toEqualHTML('<div><b>A</b></div>', true)
      expect(delta).toEqual({
        ops: [{ insert: 'A', attributes: { bold: true } }]
      })
    )

    it('setContents() with ops', ->
      ops = [{ insert: 'A', attributes: { bold: true } }]
      @quill.setContents(ops)
      expect(@quill.root).toEqualHTML('<div><b>A</b></div>', true)
      expect(ops).toEqual([{ insert: 'A', attributes: { bold: true } }])
    )

    it('setContents() with newline', ->
      delta = {
        ops: [
          { insert: 'A', attributes: { bold: true } },
          { insert: '\n' }
        ]
      }
      @quill.setContents(delta)
      expect(@quill.root).toEqualHTML('<div><b>A</b></div>', true)
    )

    it('setHTML()', ->
      @quill.setHTML('<div>A</div>')
      expect(@quill.root).toEqualHTML('<div>A</div>', true)
    )

    it('updateContents()', ->
      @quill.updateContents(new Quill.Delta().retain(2).insert('A'))
      expect(@quill.root).toEqualHTML('<div>01A23</div><div>5678</div>', true)
    )
  )

  describe('retrievals', ->
    it('getContents() all', ->
      expect(@quill.getContents()).toEqualDelta(new Quill.Delta().insert('0123\n5678\n'))
    )

    it('getContents() partial', ->
      expect(@quill.getContents(2, 7)).toEqualDelta(new Quill.Delta().insert('23\n56'))
    )

    it('getHTML()', ->
      expect(@quill.getHTML()).toEqualHTML('<div>0123</div><div>5678</div>', true)
    )

    it('getLength()', ->
      expect(@quill.getLength()).toEqual(10)
    )

    it('getText()', ->
      expect(@quill.getText()).toEqual('0123\n5678\n')
    )

    it('getActiveFormats()', ->
      @quill.formatText(0, 1, 'bold', true)
      @quill.formatText(1, 3, 'italic', true)
      @quill.formatText(0, 3, 'size', '18px')
      @quill.formatLine(0, 0, 'align', 'right')

      expect(@quill.getActiveFormats(1, 3)).toEqual({'italic': true, 'size': '18px', 'align': 'right'})
      expect(@quill.getActiveFormats(0, 5)).toEqual({})
      expect(@quill.getActiveFormats(9, 9)).toEqual({})
    )

    it('_getLeafFormats()', ->
      @quill.formatText(0, 1, 'bold', true)
      @quill.formatText(1, 3, 'italic', true)
      @quill.formatText(0, 4, 'size', '18px')

      expect(@quill._getLeafFormats(0, 0)).toEqual({'bold': true, 'size': '18px'})
    )

    it('_getLineFormats()', ->
      @quill.formatLine(0, 0, 'align', 'right')
      @quill.formatLine(6, 6, 'bullet', true)

      expect(@quill._getLineFormats(7, 9)).toEqual({'bullet': true})
    )
  )

  describe('selection', ->
    it('get/set range', ->
      @quill.setSelection(1, 2)
      range = @quill.getSelection()
      expect(range).not.toBe(null)
      expect(range.start).toEqual(1)
      expect(range.end).toEqual(2)
    )

    it('get/set index range', ->
      @quill.setSelection(new Quill.Lib.Range(2, 3))
      range = @quill.getSelection()
      expect(range).not.toBe(null)
      expect(range.start).toEqual(2)
      expect(range.end).toEqual(3)
    )

    it('get/set null', ->
      @quill.setSelection(1, 2)
      expect(range).not.toBe(null)
      @quill.setSelection(null)
      range = @quill.getSelection()
      expect(range).toBe(null)
    )
  )

  describe('events', ->
    it('format middle', (done) ->
      @quill.setHTML('<div><b>a</b><i>b</i><u>c</u></div>')
      @quill.editor.checkUpdate()
      @quill.setSelection(1, 2)
      @quill.on('text-change', (delta) ->
        expect(delta).toEqualDelta(new Quill.Delta().retain(1).retain(1, { strike: true }))
        done()
      )
      $('i', @quill.root).wrap('<s></s>')
      @quill.editor.checkUpdate()
    )

    it('ambiguous insert', (done) ->
      @quill.setHTML('<div><b>a</b><i>a</i><u>a</u></div>')
      @quill.editor.checkUpdate()
      @quill.setSelection(1, 1)
      @quill.on('text-change', (delta) ->
        expect(delta).toEqualDelta(new Quill.Delta().retain(1).insert('a', { bold: true }))
        done()
      )
      bold = @quill.root.querySelector('b')
      bold.insertBefore(document.createTextNode('a'), bold.lastChild)
      @quill.editor.checkUpdate()
    )

    it('immutability', (done) ->
      @quill.setHTML('<div>123</div>')
      expected = new Quill.Delta().insert('0')
      @quill.once('text-change', (delta) =>
        expect(delta).toEqualDelta(expected)
        delta.compose(new Quill.Delta().insert('^'))
      ).once('text-change', (delta) =>
        expect(delta).toEqualDelta(expected)
        done()
      )
      @quill.insertText(0, '0')
    )
  )

  describe('_buildParams()', ->
    tests =
      'index range string formats'  : [1, 3, 'bold', true]
      'index range object formats'  : [1, 3, { bold: true }]
      'object range string formats' : [new Quill.Lib.Range(1, 3), 'bold', true]
      'object range object formats' : [new Quill.Lib.Range(1, 3), { bold: true }]

    _.each(tests, (args, name) ->
      it(name, ->
        [start, end, formats, source] = @quill._buildParams(args...)
        expect(start).toEqual(1)
        expect(end).toEqual(3)
        expect(formats).toEqual({ bold: true })
      )
    )

    it('source override', ->
      [start, end, formats, source] = @quill._buildParams(1, 2, {}, 'silent')
      expect(source).toEqual('silent')
    )
  )

  describe('destroy()', ->
    htmlBeforeDestroying = null

    beforeEach( ->
      spyOn(@quill.editor, 'destroy')

      Destroyable = ->
        @destroy = jasmine.createSpy('destroy')
        undefined

      Quill.registerModule('destroyable', Destroyable)

      @quill.addModule('destroyable')

      @listener = jasmine.createSpy('listener')
      @quill.on('some event', @listener)

      @quill.insertText(0, 'Hello world!')
      htmlBeforeDestroying = @quill.getHTML()

      @quill.destroy()
    )

    afterEach( ->
      delete Quill.modules.destroyable
    )

    it('destroys the editor', ->
      expect(@quill.editor.destroy).toHaveBeenCalled()
    )

    it('sets the container innerHTML with the current editor html', ->
      expect(@quill.container.innerHTML).toEqual(htmlBeforeDestroying)
    )

    it('removes the editor from the global list', ->
      expect(Quill.editors.indexOf(@quill)).toEqual(-1)
    )

    it('destroys all modules that have a destroy() method', ->
      _.each(@quill.modules, (module, name) ->
        if _.isFunction(module.destroy)
          expect(module.destroy).toHaveBeenCalled()
      )
    )

    it('removes all listeners', ->
      @quill.emit('some event')
      expect(@listener).not.toHaveBeenCalled()
    )
  )
)
