import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Clipboard Module Shadow DOM Integration', () => {
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

  test('Clipboard module initializes correctly in regular DOM', () => {
    const quill = new Quill(container);

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // Verify clipboard module exists and is properly initialized
    expect(quill.clipboard).toBeDefined();
    expect(quill.clipboard.matchers).toBeDefined();
    expect(quill.clipboard.matchers.length).toBeGreaterThan(0);
  });

  test('Clipboard module initializes correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Verify clipboard module exists and is properly initialized
    expect(quill.clipboard).toBeDefined();
    expect(quill.clipboard.matchers).toBeDefined();
    expect(quill.clipboard.matchers.length).toBeGreaterThan(0);
  });

  test('HTML parsing and conversion works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Test HTML conversion functionality
    const html = `
      <h1>Heading</h1>
      <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
    `;

    const delta = quill.clipboard.convert({ html, text: '' });

    // Verify conversion worked correctly
    expect(delta.ops.length).toBeGreaterThan(0);

    // Check for specific formatting
    const hasHeading = delta.ops.some((op) => op.attributes?.header === 1);
    const hasBold = delta.ops.some((op) => op.attributes?.bold === true);
    const hasItalic = delta.ops.some((op) => op.attributes?.italic === true);
    const hasList = delta.ops.some((op) => op.attributes?.list === 'bullet');

    expect(hasHeading).toBe(true);
    expect(hasBold).toBe(true);
    expect(hasItalic).toBe(true);
    expect(hasList).toBe(true);
  });

  test('dangerouslyPasteHTML works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Set initial content
    quill.setContents([{ insert: 'Start\n' }]);

    // Use dangerouslyPasteHTML to insert formatted content
    const html = '<p>Inserted <strong>HTML</strong> content</p>';
    quill.clipboard.dangerouslyPasteHTML(5, html);

    // Verify content was inserted
    const content = quill.getContents();
    const text = content.ops
      .map((op) => (typeof op.insert === 'string' ? op.insert : ''))
      .join('');

    expect(text).toContain('Start');
    expect(text).toContain('Inserted');
    expect(text).toContain('HTML');
    expect(text).toContain('content');

    // Verify formatting was preserved
    const hasBold = content.ops.some(
      (op) => op.attributes?.bold === true && op.insert === 'HTML',
    );
    expect(hasBold).toBe(true);
  });

  test('onCopy functionality works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Set content with formatting
    quill.setContents([
      { insert: 'Shadow ' },
      { insert: 'Content', attributes: { bold: true } },
      { insert: '\n' },
    ]);

    // Test copy functionality
    const range = { index: 0, length: 14 };
    const { html, text } = quill.clipboard.onCopy(range, true);

    // Verify copy results
    expect(text).toBe('Shadow Content');
    expect(html).toContain('Shadow');
    expect(html).toContain('Content');
    expect(html).toContain('<strong>'); // Bold formatting preserved
  });

  test('Complex formatting conversion works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Test complex HTML with nested formatting
    const complexHtml = `
      <div>
        <h2>Styled Heading</h2>
        <p>
          Text with 
          <span style="font-weight: bold; font-style: italic;">bold italic</span> 
          and 
          <a href="https://example.com">link</a>
        </p>
        <blockquote>
          <p>A quote with <code>code</code> inside</p>
        </blockquote>
      </div>
    `;

    // Convert the HTML
    const delta = quill.clipboard.convert({ html: complexHtml, text: '' });

    // Verify complex formatting was processed
    const hasHeader = delta.ops.some((op) => op.attributes?.header);
    const hasBold = delta.ops.some((op) => op.attributes?.bold);
    const hasItalic = delta.ops.some((op) => op.attributes?.italic);
    const hasLink = delta.ops.some((op) => op.attributes?.link);
    const hasBlockquote = delta.ops.some((op) => op.attributes?.blockquote);
    const hasCode = delta.ops.some((op) => op.attributes?.code);

    expect(hasHeader).toBe(true);
    expect(hasBold).toBe(true);
    expect(hasItalic).toBe(true);
    expect(hasLink).toBe(true);
    expect(hasBlockquote).toBe(true);
    expect(hasCode).toBe(true);
  });

  test('Multiple Quill instances clipboard work independently', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    // Set different content in each
    regularQuill.setContents([{ insert: 'Regular content\n' }]);
    shadowQuill.setContents([{ insert: 'Shadow content\n' }]);

    // Test copy from each instance
    const regularRange = { index: 0, length: 15 };
    const shadowRange = { index: 0, length: 14 };

    const { text: regularText } = regularQuill.clipboard.onCopy(
      regularRange,
      true,
    );
    const { text: shadowText } = shadowQuill.clipboard.onCopy(
      shadowRange,
      true,
    );

    // Verify independence
    expect(regularText).toBe('Regular content');
    expect(shadowText).toBe('Shadow content');

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);
  });

  test('Matcher functions work in shadow DOM context', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Test that matchers are properly configured
    expect(quill.clipboard.matchers.length).toBeGreaterThan(0);

    // Test specific HTML structures that use matchers
    const tableHtml = `
      <table>
        <tr>
          <td>Cell 1</td>
          <td>Cell 2</td>
        </tr>
        <tr>
          <td>Cell 3</td>
          <td>Cell 4</td>
        </tr>
      </table>
    `;

    const delta = quill.clipboard.convert({ html: tableHtml, text: '' });

    // Verify table structure was processed
    expect(delta.ops.length).toBeGreaterThan(0);
    const text = delta.ops
      .map((op) => (typeof op.insert === 'string' ? op.insert : ''))
      .join('');

    expect(text).toContain('Cell 1');
    expect(text).toContain('Cell 2');
    expect(text).toContain('Cell 3');
    expect(text).toContain('Cell 4');
  });

  test('Event listeners are properly attached in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify event listeners are attached to the editor root
    // We can't easily test the actual events without complex mocking,
    // but we can verify the clipboard module has the necessary methods
    expect(typeof quill.clipboard.onCaptureCopy).toBe('function');
    expect(typeof quill.clipboard.onCapturePaste).toBe('function');

    // Verify the editor root is the correct element
    expect(quill.root.parentElement).toBe(shadowContainer);
  });

  test('Text-only paste works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Test text-only conversion
    const textData = 'Plain text content\nWith newlines\nAnd more text';
    const delta = quill.clipboard.convert({ text: textData });

    // Verify text conversion
    expect(delta.ops.length).toBe(1);
    expect(delta.ops[0].insert).toBe(textData);

    // Test applying the text
    quill.setContents(delta);
    const content = quill.getText();
    expect(content.trim()).toBe(textData);
  });
});
