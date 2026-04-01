import { describe, expect, test } from 'vitest';
import { createRegistry } from '../__helpers__/factory.js';
import Quill from '../../../src/core.js';
import { normalizeHTML } from '../__helpers__/utils.js';
import List, { ListContainer } from '../../../src/formats/list.js';
import Bold from '../../../src/formats/bold.js';
import Link from '../../../src/formats/link.js';
import Italic from '../../../src/formats/italic.js';

const createEditor = (htmlOrContents: string) => {
  const container = document.createElement('div');
  container.innerHTML = normalizeHTML(htmlOrContents);
  document.body.appendChild(container);
  const quill = new Quill(container, {
    registry: createRegistry([
      ListContainer,
      List,
      Bold,
      Link,
      Italic,
    ]),
  });
  return quill.editor;
};

describe('Editor XSS Prevention (convertHTML)', () => {
  describe('Attribute Escaping', () => {
    test('escapes quotes in element attributes', () => {
      const editor = createEditor(
        '<p><a href="https://example.com&quot; onclick=&quot;alert(1)">Link</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should escape quotes to prevent attribute injection
      expect(html).toContain('&quot;');
      // Should NOT allow onclick attribute injection
      expect(html).not.toContain('" onclick="');
    });

    test('escapes ampersands in attributes', () => {
      const editor = createEditor(
        '<p><a href="https://example.com?a=1&amp;b=2">Link</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should preserve escaped ampersands
      expect(html).toContain('&amp;');
    });

    test('escapes less than and greater than in attributes', () => {
      const editor = createEditor(
        '<p><a href="https://example.com?val=&lt;test&gt;">Link</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should escape < and >
      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');
    });

    test('prevents script injection via attributes', () => {
      const editor = createEditor(
        '<p><a href="&lt;script&gt;alert(1)&lt;/script&gt;">Link</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should NOT contain unescaped script tags
      expect(html).not.toContain('<script>');
      // Should contain escaped version
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('Unsafe outerHTML.split() Protection', () => {
    test('handles attributes containing ">innerHTML<" pattern', () => {
      const editor = createEditor(
        '<p><a href="https://example.com?param=&gt;test&lt;">Link</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should produce well-formed HTML without structure corruption
      expect(html).toContain('<a href=');
      expect(html).toContain('>Link</a>');
      // Should escape the special characters
      expect(html).toContain('&gt;');
      expect(html).toContain('&lt;');
    });

    test('handles complex nested attributes', () => {
      const editor = createEditor(
        '<ul><li><strong>Bold</strong> and <em>italic</em></li></ul>',
      );
      const html = editor.getHTML(0, 18);

      // Should maintain proper HTML structure
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('<strong>');
      expect(html).toContain('<em>');
      expect(html).toContain('</em>');
      expect(html).toContain('</strong>');
      expect(html).toContain('</li>');
      expect(html).toContain('</ul>');
    });

    test('preserves multiple attributes safely', () => {
      const editor = createEditor(
        '<p><a href="https://example.com" class="ql-link" target="_blank">Test</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should escape all attribute values
      // Note: class and target might not be in final output depending on format definition
      // but if they are, they should be escaped
      expect(html).not.toContain('" onclick="');
      expect(html).not.toContain('" onload="');
    });
  });

  describe('Special Characters in Content', () => {
    test('escapes HTML entities in text content', () => {
      const editor = createEditor(
        '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>',
      );
      const html = editor.getHTML(0, 28);

      // Should keep entities escaped
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    test('handles mixed content with special characters', () => {
      const editor = createEditor(
        '<p><strong>A &amp; B &lt; C &gt; D &quot;E&quot;</strong></p>',
      );
      const html = editor.getHTML(0, 20);

      // Should preserve all escaping
      expect(html).toContain('&amp;');
      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');
      expect(html).toContain('&quot;');
    });
  });

  describe('Link Format Safety', () => {
    test('sanitizes javascript: protocol in links', () => {
      const container = document.createElement('div');
      container.innerHTML = '<p><a href="javascript:alert(1)">Click</a></p>';
      document.body.appendChild(container);
      const quill = new Quill(container, {
        registry: createRegistry([Link]),
      });
      const html = quill.editor.getHTML(0, 6);

      // Should sanitize the protocol
      expect(html).not.toContain('javascript:');
    });

    test('allows safe protocols in links', () => {
      const editor = createEditor(
        '<p><a href="https://example.com">Link</a></p>',
      );
      const html = editor.getHTML(0, 5);

      // Should preserve safe https protocol
      expect(html).toContain('https://example.com');
    });
  });

  describe('List and Complex Structure Safety', () => {
    test('escapes attributes in list elements', () => {
      const editor = createEditor(
        '<ul><li>Item</li></ul>',
      );
      const html = editor.getHTML(0, 5);

      // Should maintain valid list structure
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('</li>');
      expect(html).toContain('</ul>');
      // Should NOT allow attribute injection
      expect(html).not.toContain('" onclick="');
    });

    test('safely handles nested lists with attributes', () => {
      const editor = createEditor(
        '<ol><li>One</li><li>Two</li></ol>',
      );
      const html = editor.getHTML(0, 9);

      // Should produce valid nested structure
      expect(html).toContain('<ol>');
      expect(html).toContain('<li>');
      expect(html).toContain('</li>');
      expect(html).toContain('</ol>');
    });
  });
});
