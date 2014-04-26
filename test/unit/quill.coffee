describe('Quill', ->
  beforeEach( ->
    @container = $('#editor-container').html('
      <div>
        <div><span>0123</span></div>
        <div><span>5678</span></div>
      </div>
    ').get(0)
    @quill = new Quill(@container.firstChild)
  )

  describe('constructor', ->
    it('string container', ->
      @container.innerHTML = '<div id="target"></div>'
      quill = new Quill('#target')
      expect(quill.editor.iframeContainer).toEqual(@container.firstChild)
    )

    it('invalid container', ->
      expect( =>
        @quill = new Quill('.none')
      ).toThrow(new Error('Invalid Quill container'))
    )
  )

  # describe('styles', ->
  #   it('addStyles()', ->

  #   )

  #   it('constructor overwrite', ->

  #   )
  # )

  describe('modules', ->
    it('addContainer()', ->
      @quill.addContainer('test-container', true)
      expect(@quill.editor.root.parentNode.querySelector('.test-container')).toEqual(@quill.editor.root.parentNode.firstChild)
    )

    it('addModule()', ->
      obj =
        before: ->
        after: ->
      spyOn(obj, 'before')
      spyOn(obj, 'after')
      expect(@quill.getModule('toolbar')).toBe(undefined)
      @quill.onModuleLoad('toolbar', obj.before)
      @quill.addModule('toolbar', { container: '#format-container' })
      expect(@quill.getModule('toolbar')).not.toBe(null)
      expect(obj.before).toHaveBeenCalled()
      @quill.onModuleLoad('toolbar', obj.after)
      expect(obj.after).toHaveBeenCalled()
    )

    it('addModule() nonexistent', ->
      expect( =>
        @quill.addModule('nonexistent')
      ).toThrow(new Error("Cannot load nonexistent module. Are you sure you included it?"))
    )
  )

  describe('manipulation', ->
    it('deleteText()', ->
      @quill.deleteText(2, 1)
      expect(@quill.editor.root).toEqualHTML('<div><span>013</span></div><div><span>5678</span></div>', true)
    )

    # it('formatLines()', ->
    #   @quill.formatLines(4, 2, 'align', 'right')
    #   expect(@quill.editor.root).toEqualHTML('
    #     <div style="text-align: right;"><span>0123</span></div>
    #     <div style="text-align: right;"><span>5678</span></div>
    #   ', true)
    # )

    it('formatText()', ->
      @quill.formatText(2, 2, 'bold', true)
      expect(@quill.editor.root).toEqualHTML('<div><span>01</span><b>23</b></div><div><span>5678</span></div>', true)
    )

    # it('insertEmbed()', ->
    #   @quill.insertEmbed(4, 'image', 'http://quilljs.com/images/icon.png')
    #   expect(@quill.editor.root).toEqualHTML('<div><span>0123</span><img src="http://quilljs.com/images/icon.png"></div><div><span>5678</span></div>', true)
    # )

    it('insertText()', ->
      @quill.insertText(2, 'A')
      expect(@quill.editor.root).toEqualHTML('<div><span>01A23</span></div><div><span>5678</span></div>', true)
    )

    it('setContents() with delta', ->
      @quill.setContents({
        startLength: 0
        endLength: 1
        ops: [{ value: 'A', attributes: { bold: true } }]
      })
      expect(@quill.editor.root).toEqualHTML('<div><b>A</b></div>', true)
    )

    it('setContents() with ops', ->
      @quill.setContents([{ value: 'A', attributes: { bold: true } }])
      expect(@quill.editor.root).toEqualHTML('<div><b>A</b></div>', true)
    )

    it('setHTML()', ->
      @quill.setHTML('<div>A</div>')
      expect(@quill.editor.root).toEqualHTML('<div><span>A</span></div>', true)
    )

    it('updateContents()', ->
      @quill.updateContents(Tandem.Delta.makeInsertDelta(10, 2, 'A'))
      expect(@quill.editor.root).toEqualHTML('<div><span>01A23</span></div><div><span>5678</span></div>', true)
    )
  )

  describe('retrievals', ->
    it('getContents()', ->
      expect(@quill.getContents()).toEqualDelta(Tandem.Delta.makeInsertDelta(0, 0, '0123\n5678\n'))
    )

    it('getHTML()', ->
      expect(@quill.getHTML()).toEqualHTML('<div><span>0123</span></div><div><span>5678</span></div>', true)
    )

    it('getLength()', ->
      expect(@quill.getLength()).toEqual(10)
    )

    it('getText()', ->
      expect(@quill.getText()).toEqual('0123\n5678\n')
    )
  )

  describe('selection', ->
    return if Quill.Utils.isIE(8)

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

  describe('_buildParams()', ->
    tests =
      'index range string formats'  : [1, 2, 'bold', true]
      'index range object formats'  : [1, 2, { bold: true }]
      'object range string formats' : [new Quill.Lib.Range(1, 3), 'bold', true]
      'object range object formats' : [new Quill.Lib.Range(1, 3), { bold: true }]

    _.each(tests, (args, name) ->
      it(name, ->
        [index, length, formats, source] = @quill._buildParams(args...)
        expect(index).toEqual(1)
        expect(length).toEqual(2)
        expect(formats).toEqual({ bold: true })
      )
    )

    it('source override', ->
      [index, length, formats, source] = @quill._buildParams(1, 2, {}, 'silent')
      expect(source).toEqual('silent')
    )
  )
)
