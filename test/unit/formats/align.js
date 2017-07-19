import Delta from 'quill-delta';
import Editor from '../../../core/editor';


describe('Align', function() {
  it('add', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(4, 1, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { align: 'center' }));
    expect(editor.scroll.domNode).toEqualHTML('<p class="ql-align-center">0123</p>');
  });

  it('remove', function() {
    let editor = this.initialize(Editor, '<p class="ql-align-center">0123</p>');
    editor.formatText(4, 1, { align: false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });

  it('whitelist', function() {
    let editor = this.initialize(Editor, '<p class="ql-align-center">0123</p>')
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(4, 1, { align: 'middle' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { align: 'center' }));
    expect(editor.scroll.domNode).toEqualHTML(initial);
  });

  it('invalid scope', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(1, 2, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML(initial);
  });
});
