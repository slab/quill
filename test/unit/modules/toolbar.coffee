describe('Toolbar', ->
  beforeEach( ->
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

  describe('format', ->
    it('button add', ->
      range = new Quill.Lib.Range(2, 4)
      @quill.setSelection(range)
      Quill.DOM.triggerEvent(@button, 'click')
      expect(@quill.getContents(range)).toEqualDelta(Quill.Delta.makeInsertDelta(0, 0, '23', { bold: true }))
    )

    it('button remove', ->
      range = new Quill.Lib.Range(0, 2)
      @quill.setSelection(range)
      Quill.DOM.triggerEvent(@button, 'click')
      expect(@quill.getContents(range)).toEqualDelta(Quill.Delta.makeInsertDelta(0, 0, '01'))
    )

    it('dropdown add', ->
      range = new Quill.Lib.Range(2, 4)
      @quill.setSelection(range)
      Quill.DOM.selectOption(@select, '18px')
      expect(@quill.getContents(range)).toEqualDelta(Quill.Delta.makeInsertDelta(0, 0, '23', { size: '18px' }))
    )

    it('dropdown remove', ->
      range = new Quill.Lib.Range(6, 8)
      @quill.setSelection(range)
      Quill.DOM.resetSelect(@select)
      expect(@quill.getContents(range)).toEqualDelta(Quill.Delta.makeInsertDelta(0, 0, '67'))
    )
  )

  describe('updateActive()', ->
    it('button', ->
      @quill.setSelection(1, 1)
      expect(Quill.DOM.hasClass(@button, 'ql-active')).toBe(true)
    )

    it('dropdown', ->
      @quill.setSelection(7, 7)
      expect(Quill.DOM.getSelectValue(@select)).toEqual('18px')
    )

    it('dropdown change', ->
      @quill.setSelection(7, 7)
      @quill.setSelection(9, 9)
      expect(Quill.DOM.getSelectValue(@select)).toEqual('32px')
    )

    it('dropdown reset', ->
      @quill.setSelection(7, 7)
      @quill.setSelection(3, 3)
      expect(Quill.DOM.getSelectValue(@select)).toEqual('13px')
    )

    it('dropdown blank', ->
      @quill.setSelection(5, 7)
      expect(Quill.DOM.getSelectValue(@select)).toEqual('')
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
)
