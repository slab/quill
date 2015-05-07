dom = Quill.Lib.DOM

describe('Toolbar', ->
  beforeEach( ->
    jasmine.resetEditor()
    @editorContainer = $('#editor-container').html('
      <div>
        <div>
          <b>01</b>23<i>45</i><span style="font-size: 18px;">67</span><span style="font-size: 32px;">89</span>
        </div>
      </div>
    ').get(0)
    @toolbarContainer = $('#toolbar-container').get(0)
    @toolbarContainer.innerHTML = @toolbarContainer.innerHTML   # Remove child listeners
    @quill = new Quill(@editorContainer.firstChild)
    @toolbar = @quill.addModule('toolbar', { container: @toolbarContainer })
    @button = @toolbarContainer.querySelector('.ql-bold')
    @select = @toolbarContainer.querySelector('.ql-size')
  )

  afterEach((done) ->
    clearInterval(@quill.editor.timer)
    _.defer(done)
  )

  describe('format', ->
    it('button add', ->
      range = new Quill.Lib.Range(2, 4)
      @quill.setSelection(range)
      dom(@button).trigger('click')
      expect(@quill.getContents(range)).toEqualDelta(new Quill.Delta().insert('23', { bold: true }))
    )

    it('button remove', ->
      range = new Quill.Lib.Range(0, 2)
      @quill.setSelection(range)
      dom(@button).trigger('click')
      expect(@quill.getContents(range)).toEqualDelta(new Quill.Delta().insert('01'))
    )

    it('dropdown add', ->
      range = new Quill.Lib.Range(2, 4)
      @quill.setSelection(range)
      dom(@select).option('18px')
      expect(@quill.getContents(range)).toEqualDelta(new Quill.Delta().insert('23', { size: '18px' }))
    )

    it('dropdown remove', ->
      range = new Quill.Lib.Range(6, 8)
      @quill.setSelection(range)
      dom(@select).reset()
      expect(@quill.getContents(range)).toEqualDelta(new Quill.Delta().insert('67'))
    )
  )

  describe('updateActive()', ->
    it('button', ->
      @quill.setSelection(1, 1)
      expect(dom(@button).hasClass('ql-active')).toBe(true)
    )

    it('dropdown', ->
      @quill.setSelection(7, 7)
      expect(dom(@select).value()).toEqual('18px')
    )

    it('dropdown change', ->
      @quill.setSelection(7, 7)
      @quill.setSelection(9, 9)
      expect(dom(@select).value()).toEqual('32px')
    )

    it('dropdown reset', ->
      @quill.setSelection(7, 7)
      @quill.setSelection(3, 3)
      expect(dom(@select).value()).toEqual('13px')
    )

    it('dropdown blank', ->
      @quill.setSelection(5, 7)
      expect(dom(@select).value()).toEqual('')
    )
  )

  describe('_getActive()', ->
    tests =
      'cursor in middle of format':
        range: [1, 1], expected: { bold: true }
      'cursor at beginning of format':
        range: [4, 4], expected: {}
      'cursor at end of format':
        range: [2, 2], expected: { bold: true }
      'neighboring formats':
        range: [2, 4], expected: {}
      'overlapping formats':
        range: [1, 3], expected: {}
      'select format':
        range: [7, 7], expected: { size: '18px' }
      'overlapping select formats':
        range: [5, 7], expected: { size: ['18px'] }

    _.each(tests, (test, name) ->
      it(name, ->
        formats = @toolbar._getActive(new Quill.Lib.Range(test.range[0], test.range[1]))
        expect(formats).toEqual(test.expected)
      )
    )
  )

  describe('_interesctFormats()', ->
    tests =
      'preserve common format':
        initial:  [{ bold: true }, { bold: true }]
        expected: { bold: true }
      'remove uncommon format':
        initial:  [{ bold: true }, { italic: true }]
        expected: {}
      'common select format':
        initial:  [{ size: '18px' }, { size: '18px' }]
        expected: { size: '18px' }
      'combine select format':
        initial:  [{ size: '18px' }, { size: '10px' }, { size: '32px' }]
        expected: { size: ['18px', '10px', '32px'] }
      'preserve select format':
        initial:  [{ bold: true }, { size: '18px' }, { italic: true }]
        expected: { size: ['18px'] }
      'combination of all cases':
        initial:  [{ bold: true, size: '10px' }, { bold: true, italic: true }, { bold: true, size: '18px' }]
        expected: { bold: true, size: ['10px', '18px'] }

    _.each(tests, (test, name) ->
      it(name, ->
        formats = @toolbar._intersectFormats(test.initial)
        expect(formats).toEqual(test.expected)
      )
    )
  )

  describe('quill content methods', ->
    beforeEach( ->
      @quill.setSelection(1, 1)
    )

    it('deleteText()', ->
      expect(dom(@button).hasClass('ql-active')).toBe(true)
      @quill.deleteText(0, 2)
      expect(dom(@button).hasClass('ql-active')).toBe(false)
    )

    it('insertEmbed()', ->
      @quill.addModule('image-tooltip', true)
      image = @toolbarContainer.querySelector('.ql-image')
      expect(dom(@button).hasClass('ql-active')).toBe(true)
      expect(dom(image).hasClass('ql-active')).toBe(false)
      @quill.insertEmbed(1, 'image', 'http://quilljs.com/images/cloud.png')
      expect(dom(@button).hasClass('ql-active')).toBe(false)
      expect(dom(image).hasClass('ql-active')).toBe(false)
    )

    it('insertText()', ->
      expect(dom(@button).hasClass('ql-active')).toBe(true)
      @quill.insertText(1, 'not-bold', 'bold', false)
      expect(dom(@button).hasClass('ql-active')).toBe(false)
    )

    it('setText()', ->
      expect(dom(@button).hasClass('ql-active')).toBe(true)
      @quill.setText('plain text')
      expect(dom(@button).hasClass('ql-active')).toBe(false)
    )

    it('setHTML()', ->
      italic = @toolbarContainer.querySelector('.ql-italic')
      expect(dom(@button).hasClass('ql-active')).toBe(true)
      expect(dom(italic).hasClass('ql-active')).toBe(false)
      @quill.setHTML('<i>italicized</i>')
      expect(dom(@button).hasClass('ql-active')).toBe(false)
      expect(dom(italic).hasClass('ql-active')).toBe(true)
    )

    it('formatText()', ->
      expect(dom(@button).hasClass('ql-active')).toBe(true)
      @quill.formatText(0, 1, 'bold', false)
      expect(dom(@button).hasClass('ql-active')).toBe(false)
    )
  )

  describe('embed button should become active when selecting', ->
    it('an image', ->
      @quill.addModule('image-tooltip', true)
      image = @toolbarContainer.querySelector('.ql-image')

      @quill.setSelection(0, 0)
      @quill.insertEmbed(0, 'image', 'http://quilljs.com/images/cloud.png')
      @quill.setSelection(0, 1)
      expect(dom(image).hasClass('ql-active')).toBe(true)
    )
  )
)
