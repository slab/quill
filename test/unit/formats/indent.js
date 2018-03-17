import Delta from 'quill-delta';
import Editor from '../../../core/editor';

describe('Indent', function() {
  it('+1', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="bullet">0123</li></ol>',
    );
    editor.formatText(4, 1, { indent: '+1' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet', indent: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<ol><li data-list="bullet" class="ql-indent-1">0123</li></ol>',
    );
  });

  it('-1', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="bullet" class="ql-indent-1">0123</li></ol>',
    );
    editor.formatText(4, 1, { indent: '-1' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet' }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<ol><li data-list="bullet">0123</li></ol>',
    );
  });
});
