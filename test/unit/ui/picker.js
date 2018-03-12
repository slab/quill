import Keyboard from '../../../modules/keyboard';
import Picker from '../../../ui/picker';

function createKeydownEvent(keyCode) {
  let event;
  if (typeof Event === 'function') {
    event = new Event('keydown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'keyCode', {'value': keyCode});
  } else if (typeof Event === 'object') {     // IE11
    event = document.createEvent('Event');
    Object.defineProperty(event, 'keyCode', {'value': keyCode});
    event.initEvent('keydown', true, true);
  }
  return event;
}

describe('Picker', function() {
  beforeEach(function () {
    this.container.innerHTML = '<select><option selected>0</option><option value="1">1</option></select>';
    this.pickerSelectorInstance = new Picker(this.container.firstChild);
    this.pickerSelector = this.container.querySelector('.ql-picker');
  });

  it('initialization', function() {
    expect(this.container.querySelector('.ql-picker')).toBeTruthy();
    expect(this.container.querySelector('.ql-active')).toBeFalsy();
    expect(this.container.querySelector('.ql-picker-item.ql-selected').outerHTML).toEqualHTML('<span tabindex="0" role="button" class="ql-picker-item ql-selected" data-label="0"></span>');
    expect(this.container.querySelector('.ql-picker-item:not(.ql-selected)').outerHTML).toEqualHTML('<span tabindex="0" role="button" class="ql-picker-item" data-value="1" data-label="1"></span>');
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

  it('label is initialized with the correct aria attributes', function() {
    expect(this.pickerSelector.querySelector('.ql-picker-label').getAttribute('aria-expanded')).toEqual('false');
    const optionsId = this.pickerSelector.querySelector('.ql-picker-options').id;
    expect(this.pickerSelector.querySelector('.ql-picker-label').getAttribute('aria-controls')).toEqual(optionsId);
  });

  it('options container is initialized with the correct aria attributes', function() {
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('true');

    const ariaControlsLabel = this.pickerSelector.querySelector('.ql-picker-label').getAttribute('aria-controls');
    expect(this.pickerSelector.querySelector('.ql-picker-options').id).toEqual(ariaControlsLabel);
    expect(this.pickerSelector.querySelector('.ql-picker-options').tabIndex).toEqual(-1);
  });

  it('aria attributes toggle correctly when the picker is opened via enter key', function() {
    const pickerLabel = this.pickerSelector.querySelector('.ql-picker-label');

    // Select picker via enter key
    const e = createKeydownEvent(Keyboard.keys.ENTER);
    pickerLabel.dispatchEvent(e);

    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('true');
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('false');
  });

  it('aria attributes toggle correctly when the picker is opened via mousedown', function() {
    const pickerLabel = this.pickerSelector.querySelector('.ql-picker-label');

    // Select picker via enter key
    let e;
    if (typeof Event === 'function') {
      e = new Event('mousedown', {
        bubbles: true,
        cancelable: true,
      });
    } else if (typeof Event === 'object') {     // IE11
      e = document.createEvent('Event');
      e.initEvent('mousedown', true, true);
    }

    pickerLabel.dispatchEvent(e);

    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('true');
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('false');
  });

  it('aria attributes toggle correctly when an item is selected via click', function() {
    const pickerLabel = this.pickerSelector.querySelector('.ql-picker-label');
    pickerLabel.click();

    const pickerItem = this.pickerSelector.querySelector('.ql-picker-item');
    pickerItem.click();

    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('true');
    expect(pickerLabel.textContent.trim()).toEqual(pickerItem.textContent.trim());
  });

  it('aria attributes toggle correctly when an item is selected via enter', function() {
    const pickerLabel = this.pickerSelector.querySelector('.ql-picker-label');
    pickerLabel.click();

    const pickerItem = this.pickerSelector.querySelector('.ql-picker-item');
    // Select picker item via enter key
    const e = createKeydownEvent(Keyboard.keys.ENTER);
    pickerItem.dispatchEvent(e);

    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('true');
    expect(pickerLabel.textContent.trim()).toEqual(pickerItem.textContent.trim());
  });

  it('aria attributes toggle correctly when the picker is closed via clicking on the label again', function() {
    const pickerLabel = this.pickerSelector.querySelector('.ql-picker-label');
    pickerLabel.click();
    pickerLabel.click();
    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('true');
  });

  it('aria attributes toggle correctly when the picker is closed via escaping out of it', function() {
    const pickerLabel = this.pickerSelector.querySelector('.ql-picker-label');
    pickerLabel.click();

    // Escape out of the picker
    const e = createKeydownEvent(Keyboard.keys.ESCAPE);
    pickerLabel.dispatchEvent(e);

    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(this.pickerSelector.querySelector('.ql-picker-options').getAttribute('aria-hidden')).toEqual('true');
  });

  afterEach(function() {
    this.pickerSelectorInstance = null;
  });
});
