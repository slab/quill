import { describe, expect, test, beforeAll } from 'vitest';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import Formula from '../../../src/formats/formula.js';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Formula]));

describe('Formula', () => {
  // Mock KaTeX for tests
  beforeAll(() => {
    // @ts-expect-error - Mocking global
    window.katex = {
      render: () => {
        // Mock render function
      },
    };
  });

  describe('XSS Prevention', () => {
    test('escapes HTML tags in formula', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const malicious = '<script>alert(1)</script>';
      editor.insertEmbed(0, 'formula', malicious);
      const html = editor.getHTML(0, 2);

      // Should NOT contain unescaped HTML
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('</script>');

      // Should contain escaped version
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&lt;/script&gt;');
    });

    test('escapes malicious closing tags', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const malicious = '</span><img src=x onerror=alert(1)>';
      editor.insertEmbed(0, 'formula', malicious);
      const html = editor.getHTML(0, 2);

      // Should NOT contain unescaped closing tag or img tag
      expect(html).not.toContain('</span><img');
      // Should not have the img tag with onerror attribute (even if words appear escaped)
      expect(html).not.toContain('<img');
      
      // Should contain escaped version
      expect(html).toContain('&lt;/span&gt;');
      expect(html).toContain('&lt;img');
    });

    test('escapes quotes in formula', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const malicious = '" onload="alert(1)';
      editor.insertEmbed(0, 'formula', malicious);
      const html = editor.getHTML(0, 2);

      // Should contain escaped quotes
      expect(html).toContain('&quot;');
      // The word "onload" might appear but should be escaped, prevent the actual exploit
      expect(html).not.toContain('" onload="');
    });

    test('escapes ampersands in formula', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const formula = 'a & b';
      editor.insertEmbed(0, 'formula', formula);
      const html = editor.getHTML(0, 2);

      // Should contain escaped ampersand
      expect(html).toContain('&amp;');
    });

    test('escapes less than and greater than operators', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const formula = 'x < 5 && y > 3';
      editor.insertEmbed(0, 'formula', formula);
      const html = editor.getHTML(0, 2);

      // Should contain escaped operators (this also fixes invalid HTML)
      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');
      expect(html).toContain('&amp;&amp;');
    });

    test('handles normal formulas without special characters', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      const formula = 'E=mc^2';
      editor.insertEmbed(0, 'formula', formula);
      const html = editor.getHTML(0, 2);

      // Should contain the formula as-is (no special chars to escape)
      expect(html).toContain('E=mc^2');
    });

    test('handles empty formula', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      editor.insertEmbed(0, 'formula', '');
      const html = editor.getHTML(0, 2);

      // Should create valid HTML even with empty formula
      expect(html).toContain('<span></span>');
    });

    test('prevents double-escaping of already-escaped content', () => {
      const editor = new Editor(createScroll('<p><br></p>'));
      // User explicitly enters escaped content
      const alreadyEscaped = '&lt;script&gt;';
      editor.insertEmbed(0, 'formula', alreadyEscaped);
      const html = editor.getHTML(0, 2);

      // Should double-escape (correct behavior - user wanted literal text)
      expect(html).toContain('&amp;lt;script&amp;gt;');
    });
  });
});

