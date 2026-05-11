import { describe, expect, test } from 'vitest';
import Picker from '../../../src/ui/picker.js';

describe('Picker', () => {
  const setup = () => {
    const container = document.body.appendChild(document.createElement('div'));
    container.innerHTML =
      '<select><option selected>0</option><option value="1">1</option></select>';
    const pickerSelectorInstance = new Picker(
      container.firstChild as HTMLSelectElement,
    );
    const pickerSelector = container.querySelector('.ql-picker') as HTMLElement;
    return { container, pickerSelectorInstance, pickerSelector };
  };

  test('initialization', () => {
    const { container } = setup();
    expect(container.querySelector('.ql-picker')).toBeTruthy();
    expect(container.querySelector('.ql-active')).toBeFalsy();
    expect(
      container.querySelector('.ql-picker-item.ql-selected')?.outerHTML,
    ).toEqualHTML(
      '<span tabindex="0" role="option" aria-selected="true" class="ql-picker-item ql-selected" data-label="0" aria-label="0"></span>',
    );
    expect(
      container.querySelector('.ql-picker-item:not(.ql-selected)')?.outerHTML,
    ).toEqualHTML(
      '<span tabindex="0" role="option" aria-selected="false" class="ql-picker-item" data-value="1" data-label="1" aria-label="1"></span>',
    );
  });

  test('escape charcters', () => {
    const { container } = setup();
    const select = document.createElement('select');
    const option = document.createElement('option');
    container.appendChild(select);
    select.appendChild(option);
    let value = '"Helvetica Neue", \'Helvetica\', sans-serif';
    option.value = value;
    value = value.replace(/"/g, '\\"');
    expect(select.querySelector(`option[value="${value}"]`)).toEqual(option);
  });

  test('label has aria-haspopup="listbox"', () => {
    const { pickerSelector } = setup();
    expect(
      pickerSelector
        .querySelector('.ql-picker-label')
        ?.getAttribute('aria-haspopup'),
    ).toEqual('listbox');
  });

  test('options container has role="listbox"', () => {
    const { pickerSelector } = setup();
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('role'),
    ).toEqual('listbox');
  });

  test('items have role="option" and aria-selected', () => {
    const { pickerSelector } = setup();
    const items = pickerSelector.querySelectorAll('.ql-picker-item');
    items.forEach((item) => {
      expect(item.getAttribute('role')).toEqual('option');
      expect(item.getAttribute('aria-selected')).toBeDefined();
    });
  });

  test('aria-selected updates when item is selected', () => {
    const { pickerSelector } = setup();
    const [firstItem, secondItem] = Array.from(
      pickerSelector.querySelectorAll('.ql-picker-item'),
    );
    expect(firstItem.getAttribute('aria-selected')).toEqual('true');
    expect(secondItem.getAttribute('aria-selected')).toEqual('false');
    secondItem.dispatchEvent(new MouseEvent('click'));
    expect(firstItem.getAttribute('aria-selected')).toEqual('false');
    expect(secondItem.getAttribute('aria-selected')).toEqual('true');
  });

  test('ArrowDown on label opens picker and focuses first item', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    pickerLabel.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(pickerSelector.classList.contains('ql-expanded')).toBe(true);
  });

  test('ArrowDown on item moves focus to next item', () => {
    const { pickerSelector } = setup();
    const [firstItem, secondItem] = Array.from(
      pickerSelector.querySelectorAll<HTMLElement>('.ql-picker-item'),
    );
    firstItem.focus();
    firstItem.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(document.activeElement).toEqual(secondItem);
  });

  test('ArrowUp on item moves focus to previous item', () => {
    const { pickerSelector } = setup();
    const [firstItem, secondItem] = Array.from(
      pickerSelector.querySelectorAll<HTMLElement>('.ql-picker-item'),
    );
    secondItem.focus();
    secondItem.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
    );
    expect(document.activeElement).toEqual(firstItem);
  });

  test('label is initialized with the correct aria attributes', () => {
    const { pickerSelector } = setup();
    expect(
      pickerSelector
        .querySelector('.ql-picker-label')
        ?.getAttribute('aria-expanded'),
    ).toEqual('false');
    const optionsId = pickerSelector.querySelector('.ql-picker-options')?.id;
    expect(
      pickerSelector
        .querySelector('.ql-picker-label')
        ?.getAttribute('aria-controls'),
    ).toEqual(optionsId);
  });

  test('options container is initialized with the correct aria attributes', () => {
    const { pickerSelector } = setup();
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('true');

    const ariaControlsLabel = pickerSelector
      .querySelector('.ql-picker-label')
      ?.getAttribute('aria-controls');
    expect(pickerSelector.querySelector('.ql-picker-options')?.id).toEqual(
      ariaControlsLabel,
    );
    expect(
      (pickerSelector.querySelector('.ql-picker-options') as HTMLSelectElement)
        .tabIndex,
    ).toEqual(-1);
  });

  test('aria attributes toggle correctly when the picker is opened via enter key', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector('.ql-picker-label');
    pickerLabel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(pickerLabel?.getAttribute('aria-expanded')).toEqual('true');
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('false');
  });

  test('aria attributes toggle correctly when the picker is opened via mousedown', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector('.ql-picker-label');
    pickerLabel?.dispatchEvent(
      new Event('mousedown', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(pickerLabel?.getAttribute('aria-expanded')).toEqual('true');
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('false');
  });

  test('aria attributes toggle correctly when an item is selected via click', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    pickerLabel.click();

    const pickerItem = pickerSelector.querySelector(
      '.ql-picker-item',
    ) as HTMLElement;
    pickerItem.click();

    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('true');
  });

  test('aria attributes toggle correctly when an item is selected via enter', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    pickerLabel.click();
    const pickerItem = pickerSelector.querySelector(
      '.ql-picker-item',
    ) as HTMLElement;
    pickerItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(pickerLabel?.getAttribute('aria-expanded')).toEqual('false');
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('true');
  });

  test('aria attributes toggle correctly when the picker is closed via clicking on the label again', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    pickerLabel.click();
    pickerLabel.click();
    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('true');
  });

  test('aria attributes toggle correctly when the picker is closed via escaping out of it', () => {
    const { pickerSelector } = setup();
    const pickerLabel = pickerSelector.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    pickerLabel.click();
    pickerLabel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(pickerLabel.getAttribute('aria-expanded')).toEqual('false');
    expect(
      pickerSelector
        .querySelector('.ql-picker-options')
        ?.getAttribute('aria-hidden'),
    ).toEqual('true');
  });
});
