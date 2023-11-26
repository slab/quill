import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import Editor from '../../../src/core/editor';
import { describe, expect, test } from 'vitest';
import List, { ListContainer } from '../../../src/formats/list';
import IndentClass from '../../../src/formats/indent';
import { AlignClass } from '../../../src/formats/align';
import Video from '../../../src/formats/video';

const createScroll = (html: string) =>
  baseCreateScroll(
    html,
    createRegistry([ListContainer, List, IndentClass, AlignClass, Video]),
  );

describe('List', () => {
  test('add', () => {
    const editor = new Editor(
      createScroll(`
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>`),
    );
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123\n5678')
        .insert('\n', { list: 'ordered' })
        .insert('0123\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <ol>
        <li data-list="ordered">5678</li>
      </ol>
      <p>0123</p>
    `);
  });

  test('checklist', () => {
    const editor = new Editor(
      createScroll(
        `
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>
    `,
      ),
    );
    editor.scroll.domNode.classList.add('ql-editor');
    editor.formatText(4, 1, { list: 'checked' });
    editor.formatText(9, 1, { list: 'unchecked' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'checked' })
        .insert('5678')
        .insert('\n', { list: 'unchecked' })
        .insert('0123\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="checked">0123</li>
        <li data-list="unchecked">5678</li>
      </ol>
      <p>0123</p>
    `);
  });

  test('remove', () => {
    const editor = new Editor(
      createScroll(
        `
      <p>0123</p>
      <ol><li data-list="ordered">5678</li></ol>
      <p>0123</p>
    `,
      ),
    );
    editor.formatText(9, 1, { list: null });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n5678\n0123\n'));
    expect(editor.scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>
    `);
  });

  test('replace', () => {
    const editor = new Editor(
      createScroll(
        `
      <p>0123</p>
      <ol><li data-list="ordered">5678</li></ol>
      <p>0123</p>
    `,
      ),
    );
    editor.formatText(9, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123\n5678')
        .insert('\n', { list: 'bullet' })
        .insert('0123\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <ol>
        <li data-list="bullet">5678</li>
      </ol>
      <p>0123</p>
    `);
  });

  test('replace checklist with bullet', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol>
        <li data-list="checked">0123</li>
      </ol>
    `,
      ),
    );
    editor.formatText(4, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="bullet">0123</li>
      </ol>
    `);
  });

  test('replace with attributes', () => {
    const editor = new Editor(
      createScroll(
        '<ol><li data-list="ordered" class="ql-align-center">0123</li></ol>',
      ),
    );
    editor.formatText(4, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { align: 'center', list: 'bullet' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li class="ql-align-center" data-list="bullet">0123</li>
      </ol>
    `);
  });

  test('format merge', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol><li data-list="ordered">0123</li></ol>
      <p>5678</p>
      <ol><li data-list="ordered">0123</li></ol>
    `,
      ),
    );
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'ordered' })
        .insert('5678')
        .insert('\n', { list: 'ordered' })
        .insert('0123')
        .insert('\n', { list: 'ordered' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">0123</li>
        <li data-list="ordered">5678</li>
        <li data-list="ordered">0123</li>
      </ol>
    `);
  });

  test('delete merge', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol><li data-list="ordered">0123</li></ol>
      <p>5678</p>
      <ol><li data-list="ordered">0123</li></ol>`,
      ),
    );
    editor.deleteText(5, 5);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'ordered' })
        .insert('0123')
        .insert('\n', { list: 'ordered' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">0123</li>
        <li data-list="ordered">0123</li>
      </ol>
    `);
  });

  test('merge checklist', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol><li data-list="checked">0123</li></ol>
      <p>5678</p>
      <ol><li data-list="checked">0123</li></ol>
    `,
      ),
    );
    editor.formatText(9, 1, { list: 'checked' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'checked' })
        .insert('5678')
        .insert('\n', { list: 'checked' })
        .insert('0123')
        .insert('\n', { list: 'checked' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="checked">0123</li>
        <li data-list="checked">5678</li>
        <li data-list="checked">0123</li>
      </ol>
    `);
  });

  test('empty line interop', () => {
    const editor = new Editor(
      createScroll('<ol><li data-list="ordered"><br></li></ol>'),
    );
    editor.insertText(0, 'Test');
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">Test</li>
      </ol>
    `);
    editor.deleteText(0, 4);
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered"><br /></li>
      </ol>
    `);
  });

  test('delete multiple items', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol>
        <li data-list="ordered">0123</li>
        <li data-list="ordered">5678</li>
        <li data-list="ordered">0123</li>
      </ol>`,
      ),
    );
    editor.deleteText(2, 5);
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">0178</li>
        <li data-list="ordered">0123</li>
      </ol>
    `);
  });

  test('delete across last item', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol><li data-list="ordered">0123</li></ol>
      <p>5678</p>`,
      ),
    );
    editor.deleteText(2, 5);
    expect(editor.scroll.domNode).toEqualHTML('<p>0178</p>');
  });

  test('delete partial', () => {
    const editor = new Editor(
      createScroll('<p>0123</p><ol><li data-list="ordered">5678</li></ol>'),
    );
    editor.deleteText(2, 5);
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">0178</li>
      </ol>
    `);
  });

  test('nested list replacement', () => {
    const editor = new Editor(
      createScroll(
        `
      <ol>
        <li data-list="bullet">One</li>
        <li class="ql-indent-1" data-list="bullet">Alpha</li>
        <li data-list="bullet">Two</li>
      </ol>
    `,
      ),
    );
    editor.formatLine(1, 10, { list: 'bullet' });
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="bullet">One</li>
        <li class="ql-indent-1" data-list="bullet">Alpha</li>
        <li data-list="bullet">Two</li>
      </ol>
    `);
  });

  test('copy atttributes', () => {
    const editor = new Editor(
      createScroll('<p class="ql-align-center">Test</p>'),
    );
    editor.formatLine(4, 1, { list: 'bullet' });
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li class="ql-align-center" data-list="bullet">Test</li>
      </ol>
    `);
  });

  test('insert block embed', () => {
    const editor = new Editor(
      createScroll('<ol><li data-list="ordered">Test</li></ol>'),
    );
    editor.insertEmbed(
      2,
      'video',
      'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0',
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">Te</li>
      </ol>
      <iframe allowfullscreen="true" class="ql-video" frameborder="0" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol>
        <li data-list="ordered">st</li>
      </ol>
    `);
  });

  test('insert block embed at beginning', () => {
    const editor = new Editor(
      createScroll('<ol><li data-list="ordered">Test</li></ol>'),
    );
    editor.insertEmbed(
      0,
      'video',
      'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0',
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <iframe allowfullscreen="true" class="ql-video" frameborder="0" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol>
        <li data-list="ordered">Test</li>
      </ol>
    `);
  });

  test('insert block embed at end', () => {
    const editor = new Editor(
      createScroll('<ol><li data-list="ordered">Test</li></ol>'),
    );
    editor.insertEmbed(
      4,
      'video',
      'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0',
    );
    expect(editor.scroll.domNode).toEqualHTML(`
      <ol>
        <li data-list="ordered">Test</li>
      </ol>
      <iframe allowfullscreen="true" class="ql-video" frameborder="0" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol>
        <li data-list="ordered"><br /></li>
      </ol>
    `);
  });
});
