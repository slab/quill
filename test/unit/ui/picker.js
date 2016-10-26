import Picker from '../../../ui/picker';

describe('Picker', function() {
  it('initialization', function() {
    this.container.innerHTML = '<select><option selected>0</option><option value="1">1</option></select>';
    let picker = new Picker(this.container.firstChild);  // eslint-disable-line no-unused-vars
    expect(this.container.querySelector('.ql-picker')).toBeTruthy();
    expect(this.container.querySelector('.ql-active')).toBeFalsy();
    expect(this.container.querySelector('.ql-picker-item.ql-selected').outerHTML).toEqualHTML('<span class="ql-picker-item ql-selected" data-label="0"></span>');
    expect(this.container.querySelector('.ql-picker-item:not(.ql-selected)').outerHTML).toEqualHTML('<span class="ql-picker-item" data-value="1" data-label="1"></span>');
  });

  it('escape charcters', function() {
    let select = document.createElement('select');
    let option = document.createElement('option');
    this.container.appendChild(select);
    select.appendChild(option);
    let value = '"Helvetica Neue", \'Helvetica\', sans-serif';
    option.value = value;
    value = value.replace(/\"/g, '\\"');
    expect(select.querySelector(`option[value="${value}"]`)).toEqual(option);
  });
});
