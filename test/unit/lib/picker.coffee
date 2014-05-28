describe('Picker', ->
  beforeEach( ->
    @container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
      <select title="Font" class="ql-font">
        <option value="sans-serif" selected>Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
    ')).get(0)
    @select = @container.querySelector('select')
    @picker = new Quill.Lib.Picker(@select)
  )

  it('constructor', ->
    expect(@container.querySelector('.ql-picker').outerHTML).toEqualHTML('
      <span title="Font" class="ql-font ql-picker">
        <span data-value="sans-serif" class="ql-picker-label">Sans Serif</span>
        <span class="ql-picker-options">
          <span data-value="sans-serif" class="ql-picker-item ql-selected">Sans Serif</span>
          <span data-value="serif" class="ql-picker-item">Serif</span>
          <span data-value="monospace" class="ql-picker-item">Monospace</span>
        </span>
      </span>
    ')
  )

  it('expand/close', (done) ->
    label = @container.querySelector('.ql-picker-label')
    picker = @container.querySelector('.ql-picker')
    Quill.DOM.triggerEvent(label, 'click')
    _.defer( ->
      expect(Quill.DOM.hasClass(picker, 'ql-expanded')).toBe(true)
      Quill.DOM.triggerEvent(label, 'click')
      _.defer( ->
        expect(Quill.DOM.hasClass(picker, 'ql-expanded')).toBe(false)
        done()
      )
    )
  )

  it('select picker item', ->
    Quill.DOM.triggerEvent(@container.querySelector('.ql-picker-options').lastChild, 'click')
    expect(Quill.DOM.getText(@picker.label)).toEqual('Monospace')
    _.each(@container.querySelectorAll('.ql-picker-item'), (item, i) ->
      expect(Quill.DOM.hasClass(item, 'ql-selected')).toBe(i == 2)
    )
  )

  it('select option', ->
    Quill.DOM.selectOption(@select, 'serif')
    expect(Quill.DOM.getText(@picker.label)).toEqual('Serif')
    _.each(@container.querySelectorAll('.ql-picker-item'), (item, i) ->
      expect(Quill.DOM.hasClass(item, 'ql-selected')).toBe(i == 1)
    )
  )

  it('select option mixed', ->
    Quill.DOM.selectOption(@select, '')
    expect(Quill.DOM.getText(@picker.label).trim()).toEqual('')
    _.each(@container.querySelectorAll('.ql-picker-item'), (item, i) ->
      expect(Quill.DOM.hasClass(item, 'ql-selected')).toBe(false)
    )
  )
)
