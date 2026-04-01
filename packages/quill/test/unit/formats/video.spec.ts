import { describe, expect, test } from 'vitest';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import Video from '../../../src/formats/video.js';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Video]));

describe('Video', () => {
  describe('XSS Prevention', () => {
    test('escapes HTML tags in video URL', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const malicious = '<script>alert(1)</script>';
      editor.insertEmbed(0, 'video', malicious);
      const html = editor.getHTML(0, 2);

      // Should NOT contain unescaped HTML
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('</script>');

      // Should contain escaped version
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&lt;/script&gt;');
    });

    test('escapes malicious attributes in video URL', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const malicious = '"><script>alert(1)</script><a href="';
      editor.insertEmbed(0, 'video', malicious);
      const html = editor.getHTML(0, 2);

      // Should NOT contain unescaped script tag
      expect(html).not.toContain('<script>');

      // Should contain escaped version
      expect(html).toContain('&lt;script&gt;');
    });

    test('escapes quotes in video URL', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const malicious = '" onclick="alert(1)';
      editor.insertEmbed(0, 'video', malicious);
      const html = editor.getHTML(0, 2);

      // Should contain escaped quotes
      expect(html).toContain('&quot;');
      // The word "onclick" will still appear but in escaped form
      // What matters is the quotes are escaped, preventing attribute injection
      expect(html).not.toContain('" onclick="');
    });

    test('escapes ampersands in video URL', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const url = 'https://example.com?a=1&b=2';
      editor.insertEmbed(0, 'video', url);
      const html = editor.getHTML(0, 2);

      // Should contain escaped ampersand in both href and text
      expect(html).toContain('&amp;');
    });

    test('handles normal video URLs', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const url = 'https://youtube.com/watch?v=abc123';
      editor.insertEmbed(0, 'video', url);
      const html = editor.getHTML(0, 2);

      // Should contain the URL
      expect(html).toContain('youtube.com/watch');
    });

    test('handles empty video URL', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      editor.insertEmbed(0, 'video', '');
      const html = editor.getHTML(0, 2);

      // Should create valid HTML even with empty URL
      expect(html).toContain('<a href=""></a>');
    });
  });
});
