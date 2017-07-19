import Delta from 'quill-delta';
import Editor from '../../../core/editor';


describe('Indent', function() {
  it('+1', function() {
    let editor = this.initialize(Editor, '<ul><li>0123</li></ul>');
    editor.formatText(4, 1, { 'indent': '+1' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { list: 'bullet', indent: 1 }));
    expect(editor.scroll.domNode).toEqualHTML('<ul><li class="ql-indent-1">0123</li></ul>');
  });

  it('-1', function() {
    let editor = this.initialize(Editor, '<ul><li class="ql-indent-1">0123</li></ul>');
    editor.formatText(4, 1, { 'indent': '-1' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { list: 'bullet' }));
    expect(editor.scroll.domNode).toEqualHTML('<ul><li>0123</li></ul>');
  });
});
