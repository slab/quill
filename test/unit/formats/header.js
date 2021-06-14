import Delta from 'quill-delta';
import Editor from '../../../core/editor';

describe('Header', function() {
  it('add', function() {
    const editor = this.initialize(Editor, '<p><em>0123</em></p>');
    editor.formatText(4, 1, { header: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123', { italic: true }).insert('\n', { header: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML('<h1><em>0123</em></h1>');
  });

  it('remove', function() {
    const editor = this.initialize(Editor, '<h1><em>0123</em></h1>');
    editor.formatText(4, 1, { header: false });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123', { italic: true }).insert('\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML('<p><em>0123</em></p>');
  });

  it('change', function() {
    const editor = this.initialize(Editor, '<h1><em>0123</em></h1>');
    editor.formatText(4, 1, { header: 2 });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123', { italic: true }).insert('\n', { header: 2 }),
    );
    expect(editor.scroll.domNode).toEqualHTML('<h2><em>0123</em></h2>');
  });
});
