import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Format Blots Shadow DOM Integration', () => {
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

  test('Script format (superscript/subscript) works in regular DOM', () => {
    const quill = new Quill(container);

    // Insert text and apply script formatting
    quill.insertText(0, 'E=mc2 H2O');

    // Apply superscript to the first '2'
    quill.formatText(4, 1, 'script', 'super');

    // Apply subscript to the second '2'
    quill.formatText(7, 1, 'script', 'sub');

    const content = quill.getContents();
    console.log(
      'Regular DOM script content:',
      JSON.stringify(content.ops, null, 2),
    );

    // Verify the HTML structure contains the correct elements
    const html = quill.root.innerHTML;
    expect(html).toContain('<sup>2</sup>');
    expect(html).toContain('<sub>2</sub>');

    // Verify script formatting exists in the delta
    const hasSuper = content.ops.some(
      (op) => op.attributes?.script === 'super',
    );
    const hasSub = content.ops.some((op) => op.attributes?.script === 'sub');
    expect(hasSuper).toBe(true);
    expect(hasSub).toBe(true);
  });

  test('Script format (superscript/subscript) works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Insert text and apply script formatting
    quill.insertText(0, 'E=mc2 H2O');

    // Apply superscript to the first '2'
    quill.formatText(4, 1, 'script', 'super');

    // Apply subscript to the second '2'
    quill.formatText(7, 1, 'script', 'sub');

    const content = quill.getContents();
    console.log(
      'Shadow DOM script content:',
      JSON.stringify(content.ops, null, 2),
    );

    // Verify the HTML structure contains the correct elements
    const html = quill.root.innerHTML;
    expect(html).toContain('<sup>2</sup>');
    expect(html).toContain('<sub>2</sub>');

    // Verify script formatting exists in the delta
    const hasSuper = content.ops.some(
      (op) => op.attributes?.script === 'super',
    );
    const hasSub = content.ops.some((op) => op.attributes?.script === 'sub');
    expect(hasSuper).toBe(true);
    expect(hasSub).toBe(true);

    // Verify the elements were created with correct document context
    const supElement = shadowContainer.querySelector('sup');
    const subElement = shadowContainer.querySelector('sub');
    expect(supElement?.ownerDocument).toBe(document);
    expect(subElement?.ownerDocument).toBe(document);
  });

  test('Text formatting (bold, italic, etc.) works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Apply various text formats
    quill.insertText(0, 'Bold Italic Underlined');
    quill.formatText(0, 4, 'bold', true);
    quill.formatText(5, 6, 'italic', true);
    quill.formatText(12, 10, 'underline', true);

    const content = quill.getContents();
    console.log(
      'Text formatting content:',
      JSON.stringify(content.ops, null, 2),
    );

    // Verify formatting exists in delta
    const hasBold = content.ops.some((op) => op.attributes?.bold === true);
    const hasItalic = content.ops.some((op) => op.attributes?.italic === true);
    const hasUnderline = content.ops.some(
      (op) => op.attributes?.underline === true,
    );

    expect(hasBold).toBe(true);
    expect(hasItalic).toBe(true);
    expect(hasUnderline).toBe(true);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    expect(html).toContain('<u>');
  });

  test('Link format works correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert text and make it a link
    quill.insertText(0, 'Visit our website');
    quill.formatText(0, 17, 'link', 'https://example.com');

    const content = quill.getContents();

    // Verify link in delta
    expect(content.ops).toEqual([
      {
        insert: 'Visit our website',
        attributes: { link: 'https://example.com' },
      },
      { insert: '\n' },
    ]);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('Visit our website</a>');

    // Verify link attributes
    const linkElement = shadowContainer.querySelector('a');
    expect(linkElement?.getAttribute('href')).toBe('https://example.com');
    expect(linkElement?.getAttribute('target')).toBe('_blank');
    expect(linkElement?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  test('Block formats (header, blockquote) work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Create header
    quill.insertText(0, 'Main Heading\n');
    quill.formatLine(0, 1, 'header', 1);

    // Create blockquote
    quill.insertText(13, 'This is a quote\n');
    quill.formatLine(13, 1, 'blockquote', true);

    const content = quill.getContents();

    // Verify block formats in delta
    expect(content.ops).toEqual([
      { insert: 'Main Heading' },
      { insert: '\n', attributes: { header: 1 } },
      { insert: 'This is a quote' },
      { insert: '\n', attributes: { blockquote: true } },
      { insert: '\n' },
    ]);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<h1>Main Heading</h1>');
    expect(html).toContain('<blockquote>This is a quote</blockquote>');
  });

  test('Embed formats (image, video) work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert image
    quill.insertEmbed(0, 'image', 'https://example.com/image.jpg');

    // Insert video
    quill.insertEmbed(1, 'video', 'https://youtube.com/watch?v=example');

    const content = quill.getContents();
    console.log('Embed formats content:', JSON.stringify(content.ops, null, 2));

    // Verify embeds exist in delta
    const hasImage = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.image === 'https://example.com/image.jpg',
    );
    const hasVideo = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.video === 'https://youtube.com/watch?v=example',
    );

    expect(hasImage).toBe(true);
    expect(hasVideo).toBe(true);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<img src="https://example.com/image.jpg"');
    expect(html).toContain('<iframe');
    expect(html).toContain('src="https://youtube.com/watch?v=example"');
  });

  test('Multiple Quill instances with different formats work independently', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    // Format text in regular DOM instance
    regularQuill.insertText(0, 'Regular Text');
    regularQuill.formatText(0, 7, 'bold', true);

    // Format text in shadow DOM instance
    shadowQuill.insertText(0, 'Shadow Text');
    shadowQuill.formatText(0, 6, 'italic', true);

    // Verify independence
    const regularContent = regularQuill.getContents();
    const shadowContent = shadowQuill.getContents();

    console.log(
      'Regular content:',
      JSON.stringify(regularContent.ops, null, 2),
    );
    console.log('Shadow content:', JSON.stringify(shadowContent.ops, null, 2));

    // Verify formatting exists
    const regularHasBold = regularContent.ops.some(
      (op) => op.attributes?.bold === true,
    );
    const shadowHasItalic = shadowContent.ops.some(
      (op) => op.attributes?.italic === true,
    );

    expect(regularHasBold).toBe(true);
    expect(shadowHasItalic).toBe(true);

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);
  });

  test('Nested formatting works correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Create complex nested formatting
    quill.insertText(0, 'This text has multiple formats');

    // Apply multiple formats to overlapping ranges
    quill.formatText(0, 4, 'bold', true); // "This"
    quill.formatText(5, 4, 'italic', true); // "text"
    quill.formatText(10, 3, 'underline', true); // "has"
    quill.formatText(23, 7, 'script', 'super'); // "formats"

    const content = quill.getContents();
    console.log(
      'Nested formatting content:',
      JSON.stringify(content.ops, null, 2),
    );

    // Check that the text content is preserved
    const text = content.ops
      .map((op) => (typeof op.insert === 'string' ? op.insert : ''))
      .join('');
    expect(text).toContain('This text has multiple formats');

    // Verify formatting exists
    const hasBold = content.ops.some((op) => op.attributes?.bold === true);
    const hasItalic = content.ops.some((op) => op.attributes?.italic === true);
    const hasUnderline = content.ops.some(
      (op) => op.attributes?.underline === true,
    );
    const hasScript = content.ops.some(
      (op) => op.attributes?.script === 'super',
    );

    expect(hasBold).toBe(true);
    expect(hasItalic).toBe(true);
    expect(hasUnderline).toBe(true);
    expect(hasScript).toBe(true);

    // Verify HTML contains all format elements
    const html = quill.root.innerHTML;
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
    expect(html).toContain('<u>');
    expect(html).toContain('<sup>');
  });
});
