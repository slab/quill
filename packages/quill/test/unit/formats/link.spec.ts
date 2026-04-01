import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import Link from '../../../src/formats/link.js';
import { describe, expect, test } from 'vitest';
import { SizeClass } from '../../../src/formats/size.js';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Link, SizeClass]));

describe('Link', () => {
  test('add', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.formatText(1, 2, { link: 'https://quilljs.com' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert('12', { link: 'https://quilljs.com' })
        .insert('3\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>0<a href="https://quilljs.com" rel="noopener noreferrer" target="_blank">12</a>3</p>',
    );
  });

  test('add invalid', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.formatText(1, 2, { link: 'javascript:alert(0);' }); // eslint-disable-line no-script-url
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert('12', { link: Link.SANITIZED_URL })
        .insert('3\n'),
    );
  });

  test('add non-whitelisted protocol', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.formatText(1, 2, { link: 'gopher://quilljs.com' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert('12', { link: Link.SANITIZED_URL })
        .insert('3\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>0<a href="about:blank" rel="noopener noreferrer" target="_blank">12</a>3</p>',
    );
  });

  test('change', () => {
    const editor = new Editor(
      createScroll(
        '<p>0<a href="https://github.com" target="_blank" rel="noopener noreferrer">12</a>3</p>',
      ),
    );
    editor.formatText(1, 2, { link: 'https://quilljs.com' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert('12', { link: 'https://quilljs.com' })
        .insert('3\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>0<a href="https://quilljs.com" rel="noopener noreferrer" target="_blank">12</a>3</p>',
    );
  });

  test('remove', () => {
    const editor = new Editor(
      createScroll(
        '<p>0<a class="ql-size-large" href="https://quilljs.com" rel="noopener noreferrer" target="_blank">12</a>3</p>',
      ),
    );
    editor.formatText(1, 2, { link: false });
    const delta = new Delta()
      .insert('0')
      .insert('12', { size: 'large' })
      .insert('3\n');
    expect(editor.getDelta()).toEqual(delta);
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>0<span class="ql-size-large">12</span>3</p>',
    );
  });
});

describe('Link XSS Prevention (getSemanticHTML)', () => {
  test('sanitizes javascript: protocol injected after insertion', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.formatText(1, 2, { link: 'https://safe.com' });

    // Simulate post-insertion DOM manipulation (e.g., via Yjs collaborative sync)
    const anchor = editor.scroll.domNode.querySelector('a')!;
    anchor.setAttribute('href', 'javascript:alert(document.cookie)'); // eslint-disable-line no-script-url

    const html = editor.getHTML(0, 4);

    // Should NOT export dangerous protocol
    expect(html).not.toContain('javascript:');
    // Should fall back to about:blank
    expect(html).toContain('href="about:blank"');
  });

  test('sanitizes data: protocol injected after insertion', () => {
    const editor = new Editor(createScroll('<p>click</p>'));
    editor.formatText(0, 5, { link: 'https://safe.com' });

    const anchor = editor.scroll.domNode.querySelector('a')!;
    anchor.setAttribute('href', 'data:text/html,<script>alert(1)</script>');

    const html = editor.getHTML(0, 5);

    expect(html).not.toContain('data:text/html');
    expect(html).toContain('href="about:blank"');
  });

  test('sanitizes vbscript: protocol injected after insertion', () => {
    const editor = new Editor(createScroll('<p>click</p>'));
    editor.formatText(0, 5, { link: 'https://safe.com' });

    const anchor = editor.scroll.domNode.querySelector('a')!;
    anchor.setAttribute('href', 'vbscript:MsgBox(1)');

    const html = editor.getHTML(0, 5);

    expect(html).not.toContain('vbscript:');
    expect(html).toContain('href="about:blank"');
  });

  test('preserves safe http: links unchanged', () => {
    const editor = new Editor(createScroll('<p>link</p>'));
    editor.formatText(0, 4, { link: 'http://example.com/path?a=1&b=2' });

    const html = editor.getHTML(0, 4);

    expect(html).toContain('href="http://example.com/path?a=1&amp;b=2"');
    expect(html).not.toContain('javascript:');
  });

  test('preserves safe https: links unchanged', () => {
    const editor = new Editor(createScroll('<p>link</p>'));
    editor.formatText(0, 4, { link: 'https://quilljs.com' });

    const html = editor.getHTML(0, 4);

    expect(html).toContain('href="https://quilljs.com"');
  });

  test('preserves mailto: links unchanged', () => {
    const editor = new Editor(createScroll('<p>email</p>'));
    editor.formatText(0, 5, { link: 'mailto:user@example.com' });

    const html = editor.getHTML(0, 5);

    expect(html).toContain('href="mailto:user@example.com"');
  });

  test('escapes special characters in href attribute value', () => {
    const editor = new Editor(createScroll('<p>link</p>'));
    editor.formatText(0, 4, { link: 'https://example.com?a=1&b=<2>' });

    const html = editor.getHTML(0, 4);

    // & and < must be HTML-entity-escaped inside an attribute
    expect(html).toContain('&amp;');
    expect(html).toContain('&lt;');
    expect(html).not.toContain('href="https://example.com?a=1&b=<2>"');
  });

  test('escapes quotes injected into href to prevent attribute breakout', () => {
    const editor = new Editor(createScroll('<p>link</p>'));
    editor.formatText(0, 4, { link: 'https://safe.com' });

    const anchor = editor.scroll.domNode.querySelector('a')!;
    anchor.setAttribute('href', 'https://safe.com" onclick="alert(1)');

    const html = editor.getHTML(0, 4);

    expect(html).not.toContain('" onclick="');
    expect(html).toContain('&quot;');
  });

  test('includes rel and target attributes safely', () => {
    const editor = new Editor(createScroll('<p>link</p>'));
    editor.formatText(0, 4, { link: 'https://example.com' });

    const html = editor.getHTML(0, 4);

    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  test('renders link text content safely (not innerHTML)', () => {
    const editor = new Editor(createScroll('<p>click here</p>'));
    editor.formatText(0, 10, { link: 'https://example.com' });

    const html = editor.getHTML(0, 10);

    // Link text should be present and safely rendered
    expect(html).toContain('>click&nbsp;here</a>');
    expect(html).toContain('href="https://example.com"');
  });
});
