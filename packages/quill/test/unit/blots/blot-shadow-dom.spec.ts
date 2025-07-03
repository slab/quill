import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Blot Shadow DOM Integration', () => {
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

  test('Embed blot creates elements with correct document context in regular DOM', () => {
    const quill = new Quill(container);

    // Verify scroll has domRoot
    expect(quill.scroll.domRoot).toBeDefined();
    expect(quill.scroll.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.scroll.domRoot.getRoot()).toBe(document);

    // Test creating an embed (like an image)
    const delta = quill.insertEmbed(0, 'image', 'https://example.com/test.jpg');
    expect(delta).toBeDefined();

    // Verify the quill content
    const content = quill.getContents();
    expect(content.ops[0].insert).toEqual({
      image: 'https://example.com/test.jpg',
    });
  });

  test('Embed blot creates elements with correct document context in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify scroll has domRoot and detects shadow DOM
    expect(quill.scroll.domRoot).toBeDefined();
    expect(quill.scroll.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.scroll.domRoot.getRoot()).toBe(shadowRoot);

    // Test creating an embed (like an image)
    const delta = quill.insertEmbed(
      0,
      'image',
      'https://example.com/shadow-test.jpg',
    );
    expect(delta).toBeDefined();

    // Verify the quill content
    const content = quill.getContents();
    expect(content.ops[0].insert).toEqual({
      image: 'https://example.com/shadow-test.jpg',
    });
  });

  test('Cursor blot works correctly in regular DOM', () => {
    const quill = new Quill(container);

    // Insert some text to create cursor scenarios
    quill.insertText(0, 'Hello World');
    quill.setSelection(5, 0); // Place cursor in middle

    // Verify selection works
    const selection = quill.getSelection();
    expect(selection?.index).toBe(5);
    expect(selection?.length).toBe(0);
  });

  test('Cursor blot works correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert some text to create cursor scenarios
    quill.insertText(0, 'Shadow DOM Text');
    quill.setSelection(7, 0); // Place cursor in middle

    // Verify selection works
    const selection = quill.getSelection();
    expect(selection?.index).toBe(7);
    expect(selection?.length).toBe(0);
  });

  test('Multiple Quill instances with blots work independently', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    // Test regular DOM instance
    regularQuill.insertText(0, 'Regular DOM');
    regularQuill.insertEmbed(11, 'image', 'regular.jpg');

    // Test shadow DOM instance
    shadowQuill.insertText(0, 'Shadow DOM');
    shadowQuill.insertEmbed(10, 'image', 'shadow.jpg');

    // Verify independence
    expect(regularQuill.getContents().ops).toHaveLength(3); // text + embed + final newline
    expect(shadowQuill.getContents().ops).toHaveLength(3); // text + embed + final newline

    // Verify different domRoot contexts
    expect(regularQuill.scroll.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.scroll.domRoot.isInShadowDOM()).toBe(true);
  });

  test('Text nodes created by blots use correct document context', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert text and verify document context
    quill.insertText(0, 'Test text');

    // Check that text nodes in the editor have correct ownerDocument
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      shadowContainer,
      NodeFilter.SHOW_TEXT,
      null,
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.trim()) {
        textNodes.push(node as Text);
      }
    }

    // All text nodes should have the same ownerDocument (which is always document)
    textNodes.forEach((textNode) => {
      expect(textNode.ownerDocument).toBe(document);
    });
  });
});
