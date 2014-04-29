describe('Toolbar', ->
  beforeEach( ->
    @editorContainer = $('#editor-container').html('
      <div>
        <b>01</b><span>23</span><i>45</i><span style="font-size: 18px;">67</span><span style="font-size: 32px;">89</span>
      </div>
    ').get(0)
    @toolbarContainer = $('#toolbar-container').get(0)
    @toolbarContainer.innerHTML = @toolbarContainer.innerHTML   # Remove child listeners
    @quill = new Quill(@editorContainer.firstChild)
    @toolbar = @quill.addModule('toolbar', { container: @toolbarContainer })
  )

  describe('updateActive()', ->
    it('button', ->
      button = @toolbarContainer.querySelector('.sc-bold')
      @quill.setSelection(1, 1)
      expect(Quill.DOM.hasClass(button, 'sc-active')).toBe(true)
      @quill.setSelection(null)
      expect(Quill.DOM.hasClass(button, 'sc-active')).toBe(false)
    )

    it('dropdown', ->
      dropdown = @toolbarContainer.querySelector('.sc-size')
      @quill.setSelection(7, 7)
      expect(Quill.DOM.getSelectValue(dropdown)).toEqual('18px')
      @quill.setSelection(9, 9)
      expect(Quill.DOM.getSelectValue(dropdown)).toEqual('32px')
      @quill.setSelection(3, 3)
      expect(Quill.DOM.getSelectValue(dropdown)).toEqual('13px')
    )

    it('dropdown blank', ->
      dropdown = @toolbarContainer.querySelector('.sc-size')
      @quill.setSelection(5, 7)
      expect(Quill.DOM.getSelectValue(dropdown)).toEqual('')
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

###

format
  similar to keyboard tests
  do selection changes similar to keyboard tests

###