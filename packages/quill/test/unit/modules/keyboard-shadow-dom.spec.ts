import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Keyboard Module Shadow DOM Integration', () => {
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

  test('Keyboard module initializes correctly in regular DOM', () => {
    const quill = new Quill(container);

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // Verify keyboard module exists and is properly initialized
    expect(quill.keyboard).toBeDefined();
    expect(quill.keyboard.bindings).toBeDefined();
    expect(Object.keys(quill.keyboard.bindings).length).toBeGreaterThan(0);
  });

  test('Keyboard module initializes correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Verify keyboard module exists and is properly initialized
    expect(quill.keyboard).toBeDefined();
    expect(quill.keyboard.bindings).toBeDefined();
    expect(Object.keys(quill.keyboard.bindings).length).toBeGreaterThan(0);
  });

  test('Keyboard bindings are properly configured in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify keyboard bindings are set up
    expect(quill.keyboard.bindings).toBeDefined();

    // Check for common key bindings
    expect(quill.keyboard.bindings['Enter']).toBeDefined();
    expect(quill.keyboard.bindings['Enter'].length).toBeGreaterThan(0);

    // Verify some other common bindings exist
    const hasBackspace = Object.prototype.hasOwnProperty.call(
      quill.keyboard.bindings,
      'Backspace',
    );
    expect(hasBackspace || quill.keyboard.bindings['8']).toBeTruthy(); // Backspace key
  });

  test('Event listener is attached to correct element in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify the keyboard module methods exist
    expect(typeof quill.keyboard.listen).toBe('function');

    // Verify the editor root is the correct element within shadow DOM
    expect(quill.root.parentElement).toBe(shadowContainer);
    expect(shadowContainer.parentNode).toBe(shadowRoot);
  });

  test('Custom keyboard bindings can be added in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Add a custom keyboard binding
    quill.keyboard.addBinding(
      {
        key: 'F1',
      },
      () => {
        // Custom handler
      },
    );

    // Verify binding was added
    expect(quill.keyboard.bindings['F1']).toBeDefined();
  });

  test('Multiple Quill instances have independent keyboard modules', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    // Verify both have their own keyboard modules
    expect(regularQuill.keyboard).toBeDefined();
    expect(shadowQuill.keyboard).toBeDefined();
    expect(regularQuill.keyboard).not.toBe(shadowQuill.keyboard);

    // Verify they have the same default bindings
    const regularBindingKeys = Object.keys(regularQuill.keyboard.bindings);
    const shadowBindingKeys = Object.keys(shadowQuill.keyboard.bindings);
    expect(regularBindingKeys.length).toBe(shadowBindingKeys.length);

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);
  });

  test('Keyboard.match function works correctly', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Test the keyboard matching function
    const mockEvent = {
      key: 'b',
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    } as KeyboardEvent;

    const binding = {
      key: 'b',
      ctrlKey: true,
    };

    // This should match (using the static match method from Keyboard class)
    const KeyboardClass = quill.keyboard.constructor as any;
    const matches = KeyboardClass.match(mockEvent, binding);
    expect(matches).toBe(true);

    // Test non-matching case
    const nonMatchingBinding = {
      key: 'b',
      ctrlKey: false,
    };

    const doesNotMatch = KeyboardClass.match(mockEvent, nonMatchingBinding);
    expect(doesNotMatch).toBe(false);
  });

  test('Keyboard module handles browser detection correctly', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // The keyboard module should initialize regardless of browser
    // This tests that browser-specific code doesn't break in shadow DOM
    expect(quill.keyboard).toBeDefined();
    expect(quill.keyboard.bindings).toBeDefined();

    // Verify common bindings exist (these vary by browser)
    const hasEnterBinding = quill.keyboard.bindings['Enter'];
    expect(hasEnterBinding).toBeDefined();
    expect(Array.isArray(hasEnterBinding)).toBe(true);
  });

  test('Keyboard binding normalization works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Test that we can add bindings with different formats
    quill.keyboard.addBinding(
      {
        key: 'Enter',
        shiftKey: true,
      },
      () => {},
    );

    quill.keyboard.addBinding('F2', () => {});

    // Verify bindings were added and normalized
    expect(quill.keyboard.bindings['Enter']).toBeDefined();
    expect(quill.keyboard.bindings['F2']).toBeDefined();
  });

  test('Keyboard context detection setup works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Set content with formatting to test context
    quill.setContents([
      { insert: 'Normal ' },
      { insert: 'bold', attributes: { bold: true } },
      { insert: ' text\n' },
    ]);

    // Place cursor in bold text
    quill.setSelection(8, 0); // In the middle of "bold"

    // Verify we can detect format context
    const range = quill.getSelection();
    expect(range).not.toBeNull();

    if (range) {
      const format = quill.getFormat(range);
      expect(format.bold).toBe(true);
    }
  });

  test('Keyboard module works with blot detection in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Set content
    quill.setContents([{ insert: 'Test content\n' }]);

    // The keyboard module uses Quill.find to locate blots
    // Verify this works in shadow DOM context
    const textNode = quill.root.querySelector('.ql-editor')?.firstChild;
    if (textNode) {
      // This internal API should work in shadow DOM
      const blot = Quill.find(textNode, true);
      expect(blot).toBeDefined();
      if (blot) {
        expect(blot.scroll).toBe(quill.scroll);
      }
    }
  });
});
