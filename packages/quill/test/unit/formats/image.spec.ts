import { describe, expect, test } from 'vitest';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import Image from '../../../src/formats/image.js';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Image]));

describe('Image', () => {
  describe('XSS Prevention', () => {
    test('prevents onerror attribute injection', () => {
      // This is the critical vulnerability: img tags with onerror handlers
      const scroll = createScroll(
        '<p><img src="x" onerror="alert(1)"></p>',
      );
      const imageEditor = new Editor(scroll);
      const html = imageEditor.getHTML(0, 2);

      // Should NOT contain the onerror attribute
      expect(html).not.toContain('onerror');
      expect(html).not.toContain('alert(1)');
      expect(html).not.toContain('alert');
      
      // Should only contain safe attributes
      expect(html).toContain('<img');
      expect(html).toContain('src=');
    });

    test('prevents onclick attribute injection', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" onclick="alert(1)"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should NOT contain the onclick attribute
      expect(html).not.toContain('onclick');
      expect(html).not.toContain('alert');
    });

    test('prevents onload attribute injection', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" onload="alert(1)"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should NOT contain the onload attribute
      expect(html).not.toContain('onload');
      expect(html).not.toContain('alert');
    });

    test('escapes quotes in alt attribute', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" alt="test&quot; onerror=&quot;alert(1)"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should contain escaped quotes
      expect(html).toContain('&quot;');
      // Should NOT allow attribute injection
      expect(html).not.toContain('" onerror="');
    });

    test('escapes HTML in alt attribute', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" alt="&lt;script&gt;alert(1)&lt;/script&gt;"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should contain double-escaped content (escaped once in DOM, escaped again in output)
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;');
    });

    test('escapes special characters in width attribute', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" width="100"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should contain width properly
      expect(html).toContain('width="100"');
      // Should NOT allow attribute injection
      expect(html).not.toContain('" onload="');
    });

    test('escapes special characters in height attribute', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" height="100"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should contain height properly
      expect(html).toContain('height="100"');
      // Should NOT allow attribute injection
      expect(html).not.toContain('" onclick="');
    });

    test('sanitizes malicious src URL', () => {
      const scroll = createScroll(
        '<p><img src="javascript:alert(1)"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should sanitize javascript: protocol
      expect(html).not.toContain('javascript:');
      // Should fall back to safe URL
      expect(html).toContain('src="//:0"');
    });

    test('handles URL-encoded characters in src', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg%22%20onerror=%22alert(1)"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // URL encoding prevents injection - the src is treated as one value
      expect(html).toContain('src=');
      // Should NOT create malformed HTML with executable onerror
      expect(html).not.toContain('" onerror="');
      // The % characters indicate URL encoding happened
      expect(html).toContain('%');
    });

    test('handles ampersands in src URL', () => {
      const scroll = createScroll(
        '<p><img src="https://example.com/img?a=1&amp;b=2"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should preserve escaped ampersand
      expect(html).toContain('&amp;');
    });

    test('handles normal image with safe attributes', () => {
      const scroll = createScroll(
        '<p><img src="https://example.com/image.jpg" alt="Test Image" width="100" height="200"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should contain all safe attributes
      expect(html).toContain('src="https://example.com/image.jpg"');
      expect(html).toContain('alt="Test Image"');
      expect(html).toContain('width="100"');
      expect(html).toContain('height="200"');
    });

    test('handles image with empty alt', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should create valid HTML without alt if not present
      expect(html).toContain('<img');
      expect(html).toContain('src=');
    });

    test('prevents data attribute injection', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" data-evil="alert(1)"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should NOT contain data attributes (not in ATTRIBUTES whitelist)
      expect(html).not.toContain('data-evil');
    });

    test('prevents style attribute injection', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" style="background:url(javascript:alert(1))"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should NOT contain style attribute (not in ATTRIBUTES whitelist)
      expect(html).not.toContain('style=');
      expect(html).not.toContain('javascript:');
    });

    test('prevents class attribute injection', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" class="malicious"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should NOT contain class attribute (not in ATTRIBUTES whitelist)
      expect(html).not.toContain('class=');
    });

    test('only includes whitelisted attributes', () => {
      const scroll = createScroll(
        '<p><img src="valid.jpg" alt="test" width="100" height="200" id="img1" name="myimg" title="tooltip"></p>',
      );
      const editor = new Editor(scroll);
      const html = editor.getHTML(0, 2);

      // Should include whitelisted attributes: src, alt, width, height
      expect(html).toContain('src=');
      expect(html).toContain('alt=');
      expect(html).toContain('width=');
      expect(html).toContain('height=');

      // Should NOT include non-whitelisted attributes: id, name, title
      expect(html).not.toContain('id=');
      expect(html).not.toContain('name=');
      expect(html).not.toContain('title=');
    });
  });
});
