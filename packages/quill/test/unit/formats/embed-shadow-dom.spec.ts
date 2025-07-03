import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '../../../src/quill.js';
import Quill from '../../../src/core/quill.js';

describe('Embed Blots Shadow DOM Integration', () => {
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

  test('Image embed works in regular DOM', () => {
    const quill = new Quill(container);

    // Verify we're in regular DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(false);
    expect(quill.domRoot.getRoot()).toBe(document);

    // Insert image embed
    quill.insertEmbed(0, 'image', 'https://example.com/test.jpg');

    const content = quill.getContents();
    expect(content.ops).toEqual([
      { insert: { image: 'https://example.com/test.jpg' } },
      { insert: '\n' },
    ]);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<img src="https://example.com/test.jpg">');

    // Verify the image element was created with correct document context
    const imgElement = container.querySelector('img');
    expect(imgElement?.ownerDocument).toBe(document);
    expect(imgElement?.getAttribute('src')).toBe(
      'https://example.com/test.jpg',
    );
  });

  test('Image embed works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Insert image embed
    quill.insertEmbed(0, 'image', 'https://example.com/shadow-test.jpg');

    const content = quill.getContents();
    expect(content.ops).toEqual([
      { insert: { image: 'https://example.com/shadow-test.jpg' } },
      { insert: '\n' },
    ]);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<img src="https://example.com/shadow-test.jpg">');

    // Verify the image element was created with correct document context
    const imgElement = shadowContainer.querySelector('img');
    expect(imgElement?.ownerDocument).toBe(document);
    expect(imgElement?.getAttribute('src')).toBe(
      'https://example.com/shadow-test.jpg',
    );
  });

  test('Video embed works in regular DOM', () => {
    const quill = new Quill(container);

    // Insert video embed
    quill.insertEmbed(0, 'video', 'https://youtube.com/watch?v=test');

    const content = quill.getContents();
    expect(content.ops).toEqual([
      { insert: { video: 'https://youtube.com/watch?v=test' } },
      { insert: '\n' },
    ]);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<iframe');
    expect(html).toContain('src="https://youtube.com/watch?v=test"');
    expect(html).toContain('class="ql-video"');
    expect(html).toContain('frameborder="0"');
    expect(html).toContain('allowfullscreen="true"');

    // Verify the iframe element was created with correct document context
    const iframeElement = container.querySelector('iframe');
    expect(iframeElement?.ownerDocument).toBe(document);
    expect(iframeElement?.getAttribute('src')).toBe(
      'https://youtube.com/watch?v=test',
    );
  });

  test('Video embed works in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Verify we're in shadow DOM context
    expect(quill.domRoot.isInShadowDOM()).toBe(true);
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);

    // Insert video embed
    quill.insertEmbed(0, 'video', 'https://vimeo.com/123456');

    const content = quill.getContents();
    expect(content.ops).toEqual([
      { insert: { video: 'https://vimeo.com/123456' } },
      { insert: '\n' },
    ]);

    // Verify HTML structure
    const html = quill.root.innerHTML;
    expect(html).toContain('<iframe');
    expect(html).toContain('src="https://vimeo.com/123456"');
    expect(html).toContain('class="ql-video"');

    // Verify the iframe element was created with correct document context
    const iframeElement = shadowContainer.querySelector('iframe');
    expect(iframeElement?.ownerDocument).toBe(document);
    expect(iframeElement?.getAttribute('src')).toBe('https://vimeo.com/123456');
  });

  test('Multiple embeds work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert multiple embeds
    quill.insertEmbed(0, 'image', 'https://example.com/image1.jpg');
    quill.insertEmbed(1, 'video', 'https://youtube.com/watch?v=video1');
    quill.insertEmbed(2, 'image', 'https://example.com/image2.png');

    const content = quill.getContents();
    console.log(
      'Multiple embeds content:',
      JSON.stringify(content.ops, null, 2),
    );

    // Verify embeds exist in delta
    const hasImage1 = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.image === 'https://example.com/image1.jpg',
    );
    const hasVideo = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.video === 'https://youtube.com/watch?v=video1',
    );
    const hasImage2 = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.image === 'https://example.com/image2.png',
    );

    expect(hasImage1).toBe(true);
    expect(hasVideo).toBe(true);
    expect(hasImage2).toBe(true);

    // Verify all elements are present
    const images = shadowContainer.querySelectorAll('img');
    const videos = shadowContainer.querySelectorAll('iframe');

    expect(images).toHaveLength(2);
    expect(videos).toHaveLength(1);

    // Verify document contexts
    images.forEach((img) => {
      expect(img.ownerDocument).toBe(document);
    });
    videos.forEach((video) => {
      expect(video.ownerDocument).toBe(document);
    });
  });

  test('Text and embeds mixed in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert mixed content step by step
    quill.insertText(0, 'Here is an image: ');
    quill.insertEmbed(18, 'image', 'https://example.com/mixed.jpg');
    quill.insertText(19, '\nAnd here is a video:\n');
    quill.insertEmbed(41, 'video', 'https://youtube.com/watch?v=mixed');
    quill.insertText(42, '\nDone!');

    const content = quill.getContents();
    console.log('Mixed content:', JSON.stringify(content.ops, null, 2));

    // Check that we have both text and embeds
    const hasText = content.ops.some(
      (op) => typeof op.insert === 'string' && op.insert.includes('Here is'),
    );
    const hasImage = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.image === 'https://example.com/mixed.jpg',
    );
    const hasVideo = content.ops.some(
      (op) =>
        typeof op.insert === 'object' &&
        op.insert?.video === 'https://youtube.com/watch?v=mixed',
    );

    expect(hasText).toBe(true);
    expect(hasImage).toBe(true);
    expect(hasVideo).toBe(true);

    // Verify HTML contains all elements
    const html = quill.root.innerHTML;
    expect(html).toContain('Here is an image:');
    expect(html).toContain('<img src="https://example.com/mixed.jpg">');
    expect(html).toContain('And here is a video:');
    expect(html).toContain('src="https://youtube.com/watch?v=mixed"');
    expect(html).toContain('Done!');
  });

  test('Embed formatting and attributes work in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert image and apply format
    quill.insertEmbed(0, 'image', 'https://example.com/formatted.jpg');

    // Get the image element and verify we can format it
    const imgElement = shadowContainer.querySelector('img');
    expect(imgElement).toBeTruthy();

    // Verify image attributes
    expect(imgElement?.getAttribute('src')).toBe(
      'https://example.com/formatted.jpg',
    );

    // Test that image can be found within shadow DOM queries
    const foundImg = quill.domRoot.querySelector('img');
    expect(foundImg).toBe(imgElement);
    expect(foundImg?.getAttribute('src')).toBe(
      'https://example.com/formatted.jpg',
    );
  });

  test('Multiple Quill instances with embeds work independently', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;

    const regularQuill = new Quill(container);
    const shadowQuill = new Quill(shadowContainer);

    // Insert different embeds in each instance
    regularQuill.insertEmbed(0, 'image', 'https://example.com/regular.jpg');
    shadowQuill.insertEmbed(0, 'video', 'https://youtube.com/watch?v=shadow');

    // Verify independence
    const regularContent = regularQuill.getContents();
    const shadowContent = shadowQuill.getContents();

    expect(regularContent.ops).toEqual([
      { insert: { image: 'https://example.com/regular.jpg' } },
      { insert: '\n' },
    ]);

    expect(shadowContent.ops).toEqual([
      { insert: { video: 'https://youtube.com/watch?v=shadow' } },
      { insert: '\n' },
    ]);

    // Verify different contexts
    expect(regularQuill.domRoot.isInShadowDOM()).toBe(false);
    expect(shadowQuill.domRoot.isInShadowDOM()).toBe(true);

    // Verify elements exist in correct containers
    expect(container.querySelector('img')).toBeTruthy();
    expect(container.querySelector('iframe')).toBeFalsy();
    expect(shadowContainer.querySelector('img')).toBeFalsy();
    expect(shadowContainer.querySelector('iframe')).toBeTruthy();
  });

  test('Embed removal works correctly in shadow DOM', () => {
    const shadowContainer = shadowRoot.querySelector(
      '#shadow-container',
    ) as HTMLElement;
    const quill = new Quill(shadowContainer);

    // Insert embed and text
    quill.insertText(0, 'Before embed\n');
    quill.insertEmbed(13, 'image', 'https://example.com/remove.jpg');
    quill.insertText(14, '\nAfter embed');

    // Verify embed is present
    expect(shadowContainer.querySelector('img')).toBeTruthy();

    // Remove the embed
    quill.deleteText(13, 1);

    // Verify embed is removed but text remains
    expect(shadowContainer.querySelector('img')).toBeFalsy();

    const content = quill.getContents();
    const text = content.ops
      .map((op) => (typeof op.insert === 'string' ? op.insert : ''))
      .join('');
    expect(text).toContain('Before embed');
    expect(text).toContain('After embed');
  });
});
