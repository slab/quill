describe('Picker', ->
  beforeEach( ->
    @container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
      <select title="Font" class="sc-font">
        <option value="sans-serif" selected>Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
    ')).get(0)
    @select = @container.querySelector('select')
    @picker = new Quill.Lib.Picker(@select)
  )

  it('constructor', ->
    expect(@container.querySelector('.sc-picker').outerHTML).toEqualHTML('
      <div title="Font" class="sc-font sc-picker">
        <div data-value="sans-serif" class="sc-picker-label">Sans Serif</div>
        <div class="sc-picker-options">
          <div data-value="sans-serif" class="sc-picker-item sc-selected">Sans Serif</div>
          <div data-value="serif" class="sc-picker-item">Serif</div>
          <div data-value="monospace" class="sc-picker-item">Monospace</div>
        </div>
      </div>
    ')
  )

  it('expand/close', ->
    label = @container.querySelector('.sc-picker-label')
    picker = @container.querySelector('.sc-picker')
    Quill.DOM.triggerEvent(label, 'click')
    expect(Quill.DOM.hasClass(picker, 'sc-expanded')).toBe(true)
    Quill.DOM.triggerEvent(label, 'click')
    expect(Quill.DOM.hasClass(picker, 'sc-expanded')).toBe(false)
  )

  it('select picker item', ->
    Quill.DOM.triggerEvent(@container.querySelector('.sc-picker-options').lastChild, 'click')
    expect(Quill.DOM.getText(@picker.label)).toEqual('Monospace')
    _.each(@container.querySelectorAll('.sc-picker-item'), (item, i) ->
      expect(Quill.DOM.hasClass(item, 'sc-selected')).toBe(i == 2)
    )
  )

  it('select option', ->
    Quill.DOM.selectOption(@select, 'serif')
    expect(Quill.DOM.getText(@picker.label)).toEqual('Serif')
    _.each(@container.querySelectorAll('.sc-picker-item'), (item, i) ->
      expect(Quill.DOM.hasClass(item, 'sc-selected')).toBe(i == 1)
    )
  )

  it('select option mixed', ->
    Quill.DOM.selectOption(@select, '')
    expect(Quill.DOM.getText(@picker.label).trim()).toEqual('')
    _.each(@container.querySelectorAll('.sc-picker-item'), (item, i) ->
      expect(Quill.DOM.hasClass(item, 'sc-selected')).toBe(false)
    )
  )
)
