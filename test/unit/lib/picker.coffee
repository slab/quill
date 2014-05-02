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
        <div class="sc-picker-label">Sans Serif</div>
        <div class="sc-picker-options">
          <div class="sc-picker-item sc-selected">Sans Serif</div>
          <div class="sc-picker-item">Serif</div>
          <div class="sc-picker-item">Monospace</div>
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
    expect(@container.querySelector('.sc-picker')).toEqualHTML('
      <div class="sc-picker-label sc-active">Monospace</div>
      <div class="sc-picker-options">
        <div class="sc-picker-item">Sans Serif</div>
        <div class="sc-picker-item">Serif</div>
        <div class="sc-picker-item sc-selected">Monospace</div>
      </div>
    ')
  )

  it('select option', ->
    Quill.DOM.selectOption(@select, 'serif')
    expect(@container.querySelector('.sc-picker')).toEqualHTML('
      <div class="sc-picker-label sc-active">Serif</div>
      <div class="sc-picker-options">
        <div class="sc-picker-item">Sans Serif</div>
        <div class="sc-picker-item sc-selected">Serif</div>
        <div class="sc-picker-item">Monospace</div>
      </div>
    ')
  )

  it('select option mixed', ->
    Quill.DOM.selectOption(@select, '')
    expect(@container.querySelector('.sc-picker')).toEqualHTML('
      <div class="sc-picker-label sc-active">&nbsp;</div>
      <div class="sc-picker-options">
        <div class="sc-picker-item">Sans Serif</div>
        <div class="sc-picker-item">Serif</div>
        <div class="sc-picker-item">Monospace</div>
      </div>
    ')
  )
)
