import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Quill DOMRoot Integration', () => {
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

  test('Quill initializes with DOMRoot in regular DOM', () => {
    const quill = new Quill(container);

    expect(quill.domRoot).toBeDefined();
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);
  });

  test('Quill initializes with DOMRoot in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    expect(quill.domRoot).toBeDefined();
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);
  });

  test('addContainer uses DOMRoot for element creation in regular DOM', () => {
    const quill = new Quill(container);

    const newContainer = quill.addContainer('test-container');

    expect(newContainer.classList.contains('test-container')).toBe(true);
    expect(newContainer.ownerDocument).toBe(document);
    expect(container.contains(newContainer)).toBe(true);
  });

  test('addContainer uses DOMRoot for element creation in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    const newContainer = quill.addContainer('test-shadow-container');

    expect(newContainer.classList.contains('test-shadow-container')).toBe(true);
    expect(newContainer.ownerDocument).toBe(document);
    expect(shadowContainer.contains(newContainer)).toBe(true);
  });

  test('DOMRoot context is correctly detected during initialization', () => {
    // Regular DOM
    const regularQuill = new Quill(container);
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);

    // Shadow DOM
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const shadowQuill = new Quill(shadowContainer);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);
  });

  test('Multiple Quill instances can coexist with different DOMRoot contexts', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);
    expect(regularQuill.domRoot.getRoot()).toBe(document);
    expect(shadowQuill.domRoot.getRoot()).toBe(shadowRoot);
  });

  test('DOMRoot is available as public property', () => {
    const quill = new Quill(container);

    // Verify DOMRoot is accessible and has expected methods
    expect(typeof quill.domRoot.querySelector).toBe('function');
    expect(typeof quill.domRoot.createElement).toBe('function');
    expect(typeof quill.domRoot.injectCSS).toBe('function');
    expect(typeof quill.domRoot.addEventListener).toBe('function');
    expect(typeof quill.domRoot.getSelection).toBe('function');
  });
});
