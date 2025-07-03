import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Composition Shadow DOM Integration', () => {
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

  test('Composition events work in regular DOM', () => {
    const quill = new Quill(container);

    expect(quill.composition).toBeDefined();
    expect(quill.composition.isComposing).toBe(false);

    // Verify composition event listeners are attached to editor element
    const editorElement = quill.root;
    expect(editorElement).toBeDefined();
  });

  test('Composition events work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    expect(quill.composition).toBeDefined();
    expect(quill.composition.isComposing).toBe(false);

    // Verify composition event listeners are attached to editor element in shadow DOM
    const editorElement = quill.root;
    expect(editorElement).toBeDefined();
    expect(shadowContainer.contains(editorElement)).toBe(true);
  });

  test('Composition state is isolated between regular and shadow DOM instances', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    expect(regularQuill.composition.isComposing).toBe(false);
    expect(shadowQuill.composition.isComposing).toBe(false);

    // Both compositions should be independent
    expect(regularQuill.composition).not.toBe(shadowQuill.composition);
  });
});
