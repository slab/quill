dom = Quill.Lib.DOM

describe('Picker', ->
  beforeEach( ->
    @container = $('#editor-container').html(Quill.Lib.Normalizer.stripWhitespace('
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
    dom(label).trigger('click')
    _.defer( ->
      expect(dom(picker).hasClass('ql-expanded')).toBe(true)
      dom(label).trigger('click')
      _.defer( ->
        expect(dom(picker).hasClass('ql-expanded')).toBe(false)
        done()
      )
    )
  )

  it('select picker item', ->
    dom(@container.querySelector('.ql-picker-options').lastChild).trigger('click')
    expect(dom(@picker.label).text()).toEqual('Monospace')
    _.each(@container.querySelectorAll('.ql-picker-item'), (item, i) ->
      expect(dom(item).hasClass('ql-selected')).toBe(i == 2)
    )
  )

  it('select option', ->
    dom(@select).selectOption('serif')
    expect(dom(@picker.label).text()).toEqual('Serif')
    _.each(@container.querySelectorAll('.ql-picker-item'), (item, i) ->
      expect(dom(item).hasClass('ql-selected')).toBe(i == 1)
    )
  )

  it('select option mixed', ->
    dom(@select).selectOption('')
    expect(dom(@picker.label).text().trim()).toEqual('')
    _.each(@container.querySelectorAll('.ql-picker-item'), (item, i) ->
      expect(dom(item).hasClass('ql-selected')).toBe(false)
    )
  )
)
