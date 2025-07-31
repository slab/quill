import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import List, { ListContainer } from '../../../src/formats/list.js';
import IndentClass from '../../../src/formats/indent.js';
import { describe, expect, test } from 'vitest';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([ListContainer, List, IndentClass]));

describe('Indent', () => {
  test('+1', () => {
    const editor = new Editor(
      createScroll(
        '<ol><li class="ql-list-item ql-list-item-bullet">0123</li></ol>',
      ),
    );
    editor.formatText(4, 1, { indent: '+1' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet', indent: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li class="ql-list-item ql-list-item-bullet ql-indent-1">0123</li>
      </ol>
    `);
  });

  test('-1', () => {
    const editor = new Editor(
      createScroll(
        '<ol><li class="ql-list-item ql-list-item-bullet ql-indent-1">0123</li></ol>',
      ),
    );
    editor.formatText(4, 1, { indent: '-1' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li class="ql-list-item ql-list-item-bullet">0123</li>
      </ol>
    `);
  });

  test('1', () => {
    const editor = new Editor(createScroll('<p>abc</p>'));
    editor.formatText(3, 1, { indent: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('abc').insert('\n', { indent: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`<p class="ql-indent-1">abc</p>`);
  });
});
