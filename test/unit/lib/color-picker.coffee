describe('ColorPicker', ->
  it('constructor', ->
    container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
      <select title="Text Color" class="sc-color">
        <option value="rgb(0, 0, 0)" selected></option>
        <option value="rgb(230, 0, 0)"></option>
        <option value="rgb(255, 153, 0)"></option>
        <option value="rgb(255, 255, 0)"></option>
        <option value="rgb(0, 138, 0)"></option>
        <option value="rgb(0, 102, 204)"></option>
      </select>
    ')).get(0)
    select = container.querySelector('select')
    picker = new Quill.Lib.ColorPicker(select)
    expect(container.querySelector('.sc-color-picker').outerHTML).toEqualHTML('
      <div title="Text Color" class="sc-color sc-picker sc-color-picker">
        <div class="sc-picker-label"></div>
        <div class="sc-picker-options">
          <div class="sc-picker-item sc-selected" style="background-color: rgb(0, 0, 0);"></div>
          <div class="sc-picker-item style="background-color: rgb(230, 0, 0);"></div>
          <div class="sc-picker-item style="background-color: rgb(255, 153, 0);"></div>
          <div class="sc-picker-item style="background-color: rgb(255, 255, 0);"></div>
          <div class="sc-picker-item style="background-color: rgb(0, 138, 0);"></div>
          <div class="sc-picker-item style="background-color: rgb(0, 102, 204);"></div>
        </div>
      </div>
    ')
  )
)
