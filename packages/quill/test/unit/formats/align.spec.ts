import Delta from 'quill-delta';
import Editor from '../../../src/core/editor';
import { describe, test, expect } from 'vitest';
import {
  createRegistry,
  createScroll as baseCreateScroll,
} from '../__helpers__/factory';
import { AlignClass } from '../../../src/formats/align';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([AlignClass]));

describe('Align', () => {
  test('add', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.formatText(4, 1, { align: 'center' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { align: 'center' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p class="ql-align-center">0123</p>',
    );
  });

  test('remove', () => {
    const editor = new Editor(
      createScroll('<p class="ql-align-center">0123</p>'),
    );
    editor.formatText(4, 1, { align: false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });

  test('whitelist', () => {
    const editor = new Editor(
      createScroll('<p class="ql-align-center">0123</p>'),
    );
    editor.formatText(4, 1, { align: 'middle' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { align: 'center' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p class="ql-align-center">0123</p>',
    );
  });

  test('invalid scope', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.formatText(1, 2, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });
});
