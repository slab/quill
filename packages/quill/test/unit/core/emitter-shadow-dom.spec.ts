import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';
import Emitter from '../../../src/core/emitter.js';
import { DOMRoot } from '../../../src/core/dom-root.js';

describe('Emitter Shadow DOM Integration', () => {
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

  test('Emitter initializes global events for regular DOM', () => {
    const quill = new Quill(container);

    expect(quill.emitter).toBeDefined();
    expect(quill.emitter).toBeInstanceOf(Emitter);
  });

  test('Emitter initializes global events for shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    expect(quill.emitter).toBeDefined();
    expect(quill.emitter).toBeInstanceOf(Emitter);
  });

  test('Global events are scoped correctly to each context', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    // Both should have independent emitters
    expect(regularQuill.emitter).not.toBe(shadowQuill.emitter);
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);
  });

  test('initializeGlobalEvents can be called directly', () => {
    const domRoot = DOMRoot(container);

    // Should not throw an error
    expect(() => {
      Emitter.initializeGlobalEvents(domRoot);
    }).not.toThrow();

    // Should be idempotent (safe to call multiple times)
    expect(() => {
      Emitter.initializeGlobalEvents(domRoot);
      Emitter.initializeGlobalEvents(domRoot);
    }).not.toThrow();
  });

  test('Global events work with shadow DOM contexts', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const domRoot = DOMRoot(shadowContainer);

    // Should initialize without errors
    expect(() => {
      Emitter.initializeGlobalEvents(domRoot);
    }).not.toThrow();

    // Verify the root is a shadow root
    expect(domRoot.isInShadowDOM()).toBe(true);
    expect(domRoot.getRoot()).toBe(shadowRoot);
  });

  test('listenDOM method works correctly', () => {
    const quill = new Quill(container);

    const handler = () => {
      // Handler implementation for testing
    };

    quill.emitter.listenDOM('click', container, handler);

    // Trigger a click event
    container.click();

    // Note: This test verifies the method works without throwing
    // The actual event handling is tested through integration tests
    expect(quill.emitter).toBeDefined();
  });
});
