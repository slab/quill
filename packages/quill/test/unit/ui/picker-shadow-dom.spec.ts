import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('UI Components Shadow DOM Integration', () => {
  let container: HTMLElement;
  let shadowHost: HTMLElement;
  let shadowRoot: ShadowRoot;

  beforeEach(() => {
    // Create regular DOM container
    container = document.createElement('div');
    container.id = 'regular-container';
    document.body.appendChild(container);

    // Create shadow DOM setup
    shadowHost = document.createElement('div');
    shadowHost.id = 'shadow-host';
    document.body.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    const shadowContainer = document.createElement('div');
    shadowContainer.id = 'shadow-container';
    shadowRoot.appendChild(shadowContainer);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(shadowHost);
  });

  test('Picker components initialize correctly in regular DOM', () => {
    const quill = new Quill(container, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }],
        ],
      },
    });

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // In regular DOM, toolbar is inserted into parent (document.body)
    const headerPicker = document.body.querySelector('.ql-header.ql-picker');
    const sizePicker = document.body.querySelector('.ql-size.ql-picker');
    const colorPicker = document.body.querySelector('.ql-color.ql-picker');
    const backgroundPicker = document.body.querySelector(
      '.ql-background.ql-picker',
    );

    expect(headerPicker).toBeTruthy();
    expect(sizePicker).toBeTruthy();
    expect(colorPicker).toBeTruthy();
    expect(backgroundPicker).toBeTruthy();

    // Verify picker structure
    expect(headerPicker?.querySelector('.ql-picker-label')).toBeTruthy();
    expect(headerPicker?.querySelector('.ql-picker-options')).toBeTruthy();
  });

  test('Picker components initialize correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }],
        ],
      },
    });

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Verify picker elements exist within shadow DOM
    const headerPicker = shadowRoot.querySelector('.ql-header');
    const sizePicker = shadowRoot.querySelector('.ql-size');
    const colorPicker = shadowRoot.querySelector('.ql-color');
    const backgroundPicker = shadowRoot.querySelector('.ql-background');

    expect(headerPicker).toBeTruthy();
    expect(sizePicker).toBeTruthy();
    expect(colorPicker).toBeTruthy();
    expect(backgroundPicker).toBeTruthy();

    // Verify picker structure
    expect(headerPicker?.querySelector('.ql-picker-label')).toBeTruthy();
    expect(headerPicker?.querySelector('.ql-picker-options')).toBeTruthy();

    // Verify elements have correct document context
    expect(headerPicker?.ownerDocument).toBe(document);
    expect(sizePicker?.ownerDocument).toBe(document);
    expect(colorPicker?.ownerDocument).toBe(document);
    expect(backgroundPicker?.ownerDocument).toBe(document);
  });

  test('Header picker functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ header: [1, 2, 3, false] }],
      },
    });

    // Insert some text
    quill.setText('Header test text');
    quill.setSelection(0, 6); // Select "Header"

    // Find header picker (use specific selector for picker span, not select)
    const headerPicker = shadowRoot.querySelector(
      '.ql-header.ql-picker',
    ) as HTMLElement;
    expect(headerPicker).toBeTruthy();

    // Verify picker can be expanded
    const pickerLabel = headerPicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    expect(pickerLabel).toBeTruthy();

    // Click to expand picker (using mousedown event)
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
    pickerLabel.dispatchEvent(mousedownEvent);
    expect(headerPicker.classList.contains('ql-expanded')).toBe(true);

    // Find header options
    const headerOptions = headerPicker.querySelectorAll('.ql-picker-item');
    expect(headerOptions.length).toBeGreaterThan(0);

    // Click on H1 option (should be first option)
    const h1Option = headerOptions[0] as HTMLElement;
    h1Option.click();

    // Verify formatting was applied (header is a block format applied to the newline)
    const delta = quill.getContents();
    expect(delta.ops[1].attributes?.header).toBe(1);
    expect(delta.ops[0].insert).toBe('Header test text');
  });

  test('Size picker functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ size: ['small', false, 'large', 'huge'] }],
      },
    });

    // Insert some text
    quill.setText('Size test text');
    quill.setSelection(0, 4); // Select "Size"

    // Find size picker
    const sizePicker = shadowRoot.querySelector(
      '.ql-size.ql-picker',
    ) as HTMLElement;
    expect(sizePicker).toBeTruthy();

    // Expand picker
    const pickerLabel = sizePicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
    pickerLabel.dispatchEvent(mousedownEvent);
    expect(sizePicker.classList.contains('ql-expanded')).toBe(true);

    // Find size options
    const sizeOptions = sizePicker.querySelectorAll('.ql-picker-item');
    expect(sizeOptions.length).toBeGreaterThan(0);

    // Click on large option
    const largeOption = Array.from(sizeOptions).find(
      (option) => option.getAttribute('data-value') === 'large',
    ) as HTMLElement;
    expect(largeOption).toBeTruthy();
    largeOption.click();

    // Verify formatting was applied
    const delta = quill.getContents();
    expect(delta.ops[0].attributes?.size).toBe('large');
    expect(delta.ops[0].insert).toBe('Size');
  });

  test('Color picker functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ color: [] }],
      },
    });

    // Insert some text
    quill.setText('Color test text');
    quill.setSelection(0, 5); // Select "Color"

    // Find color picker
    const colorPicker = shadowRoot.querySelector(
      '.ql-color.ql-picker',
    ) as HTMLElement;
    expect(colorPicker).toBeTruthy();
    expect(colorPicker.classList.contains('ql-color-picker')).toBe(true);

    // Expand picker
    const pickerLabel = colorPicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
    pickerLabel.dispatchEvent(mousedownEvent);
    expect(colorPicker.classList.contains('ql-expanded')).toBe(true);

    // Find color options
    const colorOptions = colorPicker.querySelectorAll('.ql-picker-item');
    expect(colorOptions.length).toBeGreaterThan(0);

    // Verify primary colors exist
    const primaryColors = colorPicker.querySelectorAll(
      '.ql-picker-item.ql-primary',
    );
    expect(primaryColors.length).toBe(7); // Should have 7 primary colors

    // Click on a color option
    const redOption = Array.from(colorOptions).find(
      (option) =>
        (option as HTMLElement).style.backgroundColor === 'rgb(230, 0, 0)',
    ) as HTMLElement;

    if (redOption) {
      redOption.click();

      // Verify formatting was applied
      const delta = quill.getContents();
      expect(delta.ops[0].attributes?.color).toBeTruthy();
      expect(delta.ops[0].insert).toBe('Color');
    }
  });

  test('Background color picker functionality works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ background: [] }],
      },
    });

    // Insert some text
    quill.setText('Background test');
    quill.setSelection(0, 10); // Select "Background"

    // Find background picker
    const backgroundPicker = shadowRoot.querySelector(
      '.ql-background.ql-picker',
    ) as HTMLElement;
    expect(backgroundPicker).toBeTruthy();
    expect(backgroundPicker.classList.contains('ql-color-picker')).toBe(true);

    // Expand picker
    const pickerLabel = backgroundPicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
    pickerLabel.dispatchEvent(mousedownEvent);
    expect(backgroundPicker.classList.contains('ql-expanded')).toBe(true);

    // Find background options
    const backgroundOptions =
      backgroundPicker.querySelectorAll('.ql-picker-item');
    expect(backgroundOptions.length).toBeGreaterThan(0);

    // Click on a background option
    const yellowOption = Array.from(backgroundOptions).find(
      (option) =>
        (option as HTMLElement).style.backgroundColor === 'rgb(255, 255, 0)',
    ) as HTMLElement;

    if (yellowOption) {
      yellowOption.click();

      // Verify formatting was applied
      const delta = quill.getContents();
      expect(delta.ops[0].attributes?.background).toBeTruthy();
      expect(delta.ops[0].insert).toBe('Background');
    }
  });

  test('Picker keyboard navigation works in shadow DOM', async () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ header: [1, 2, 3, false] }],
      },
    });

    // Ensure quill context is available
    expect(quill).toBeTruthy();

    // Find header picker
    const headerPicker = shadowRoot.querySelector(
      '.ql-header.ql-picker',
    ) as HTMLElement;
    const pickerLabel = headerPicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;

    // Focus the picker label
    pickerLabel.focus();
    // In shadow DOM, document.activeElement will be the shadow host
    // Use shadowRoot.activeElement to get the actual focused element
    const actualActiveElement =
      shadowRoot.activeElement || document.activeElement;
    expect(actualActiveElement).toBe(pickerLabel);

    // Simulate Enter key to expand picker
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    pickerLabel.dispatchEvent(enterEvent);
    expect(headerPicker.classList.contains('ql-expanded')).toBe(true);

    // Simulate Escape key to close picker
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    pickerLabel.dispatchEvent(escapeEvent);
    expect(headerPicker.classList.contains('ql-expanded')).toBe(false);
  });

  test('Picker ARIA attributes work correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ header: [1, 2, 3, false] }],
      },
    });

    // Ensure quill context is available
    expect(quill).toBeTruthy();

    // Find header picker
    const headerPicker = shadowRoot.querySelector(
      '.ql-header.ql-picker',
    ) as HTMLElement;
    const pickerLabel = headerPicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    const pickerOptions = headerPicker.querySelector(
      '.ql-picker-options',
    ) as HTMLElement;

    // Verify initial ARIA attributes
    expect(pickerLabel.getAttribute('aria-expanded')).toBe('false');
    expect(pickerLabel.getAttribute('role')).toBe('button');
    expect(pickerOptions.getAttribute('aria-hidden')).toBe('true');
    expect(pickerLabel.getAttribute('aria-controls')).toBe(pickerOptions.id);

    // Expand picker
    const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
    pickerLabel.dispatchEvent(mousedownEvent);

    // Verify ARIA attributes after expansion
    expect(pickerLabel.getAttribute('aria-expanded')).toBe('true');
    expect(pickerOptions.getAttribute('aria-hidden')).toBe('false');

    // Verify picker items have correct ARIA
    const pickerItems = pickerOptions.querySelectorAll('.ql-picker-item');
    pickerItems.forEach((item) => {
      expect(item.getAttribute('role')).toBe('button');
      expect(item.getAttribute('tabindex')).toBe('0');
    });
  });

  test('Multiple Quill instances with pickers work independently', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container, {
      theme: 'snow',
      modules: {
        toolbar: [{ header: [1, 2, false] }],
      },
    });

    const shadowQuill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ size: ['small', 'large'] }],
      },
    });

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);

    // Verify independent picker sets
    const regularHeaderPicker = document.body.querySelector(
      '.ql-header.ql-picker',
    );
    const regularSizePicker = document.body.querySelector('.ql-size.ql-picker');
    const shadowHeaderPicker = shadowRoot.querySelector('.ql-header.ql-picker');
    const shadowSizePicker = shadowRoot.querySelector('.ql-size.ql-picker');

    // Regular instance should have header picker but not size picker
    expect(regularHeaderPicker).toBeTruthy();
    expect(regularSizePicker).toBeFalsy();

    // Shadow instance should have size picker but not header picker
    expect(shadowHeaderPicker).toBeFalsy();
    expect(shadowSizePicker).toBeTruthy();

    // Set text in both instances
    regularQuill.setText('Regular instance');
    shadowQuill.setText('Shadow instance');

    // Select text and apply formatting independently
    regularQuill.setSelection(0, 7); // Select "Regular"
    shadowQuill.setSelection(0, 6); // Select "Shadow"

    // Expand both pickers
    const regularLabel = regularHeaderPicker?.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    const shadowLabel = shadowSizePicker?.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;

    const regularMousedown = new MouseEvent('mousedown', { bubbles: true });
    const shadowMousedown = new MouseEvent('mousedown', { bubbles: true });
    regularLabel.dispatchEvent(regularMousedown);
    shadowLabel.dispatchEvent(shadowMousedown);

    // Verify both are expanded independently
    expect(regularHeaderPicker?.classList.contains('ql-expanded')).toBe(true);
    expect(shadowSizePicker?.classList.contains('ql-expanded')).toBe(true);
  });

  test('Picker element creation uses correct document context', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [{ header: [1, 2, 3, false] }],
      },
    });

    // Ensure quill context is available
    expect(quill).toBeTruthy();

    // Find header picker and its elements
    const headerPicker = shadowRoot.querySelector(
      '.ql-header.ql-picker',
    ) as HTMLElement;
    const pickerLabel = headerPicker.querySelector(
      '.ql-picker-label',
    ) as HTMLElement;
    const pickerOptions = headerPicker.querySelector(
      '.ql-picker-options',
    ) as HTMLElement;
    const pickerItems = headerPicker.querySelectorAll('.ql-picker-item');

    // Verify all elements have correct document context
    expect(headerPicker.ownerDocument).toBe(document);
    expect(pickerLabel.ownerDocument).toBe(document);
    expect(pickerOptions.ownerDocument).toBe(document);

    pickerItems.forEach((item) => {
      expect(item.ownerDocument).toBe(document);
    });

    // Verify elements exist within shadow root
    expect(shadowRoot.contains(headerPicker)).toBe(true);
    expect(shadowRoot.contains(pickerLabel)).toBe(true);
    expect(shadowRoot.contains(pickerOptions)).toBe(true);

    pickerItems.forEach((item) => {
      expect(shadowRoot.contains(item)).toBe(true);
    });
  });

  test('Picker styling and CSS classes work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer, {
      theme: 'snow',
      modules: {
        toolbar: [[{ header: [1, 2, 3, false] }], [{ color: [] }]],
      },
    });

    // Ensure quill context is available
    expect(quill).toBeTruthy();

    // Verify picker elements have correct CSS classes
    const headerPicker = shadowRoot.querySelector(
      '.ql-header.ql-picker',
    ) as HTMLElement;
    const colorPicker = shadowRoot.querySelector(
      '.ql-color.ql-picker',
    ) as HTMLElement;

    expect(headerPicker.classList.contains('ql-picker')).toBe(true);
    expect(colorPicker.classList.contains('ql-picker')).toBe(true);
    expect(colorPicker.classList.contains('ql-color-picker')).toBe(true);

    // Verify picker structure classes
    const headerLabel = headerPicker.querySelector('.ql-picker-label');
    const headerOptions = headerPicker.querySelector('.ql-picker-options');
    const headerItems = headerPicker.querySelectorAll('.ql-picker-item');

    expect(headerLabel).toBeTruthy();
    expect(headerOptions).toBeTruthy();
    expect(headerItems.length).toBeGreaterThan(0);

    // Verify color picker specific classes
    const colorLabel = colorPicker.querySelector('.ql-picker-label');
    const colorOptions = colorPicker.querySelector('.ql-picker-options');
    const primaryColors = colorPicker.querySelectorAll(
      '.ql-picker-item.ql-primary',
    );

    expect(colorLabel).toBeTruthy();
    expect(colorOptions).toBeTruthy();
    expect(primaryColors.length).toBe(7); // Should have 7 primary colors
  });
});
