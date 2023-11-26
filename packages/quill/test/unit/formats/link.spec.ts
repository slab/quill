import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import Editor from '../../../src/core/editor';
import Link from '../../../src/formats/link';
import { describe, expect, test } from 'vitest';
import { SizeClass } from '../../../src/formats/size';

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
