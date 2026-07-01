import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import Image from '../../../src/formats/image.js';
import { describe, expect, test } from 'vitest';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Image]));

describe('Image', () => {
  test('add', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.insertEmbed(1, 'image', 'https://quilljs.com/assets/favicon.png');
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert({ image: 'https://quilljs.com/assets/favicon.png' })
        .insert('123\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>0<img src="https://quilljs.com/assets/favicon.png">123</p>',
    );
  });

  test('add invalid', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.insertEmbed(1, 'image', 'javascript:alert(0);'); // eslint-disable-line no-script-url
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert({ image: '//:0' })
        .insert('123\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>0<img src="//:0">123</p>',
    );
  });

  test('add data url', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    editor.insertEmbed(1, 'image', dataUrl);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert({ image: dataUrl })
        .insert('123\n'),
    );
  });
});
