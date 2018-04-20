import Delta from 'quill-delta';
import Editor from '../../../core/editor';


describe('Author', function() {
  it('add block + inline', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(0, 5, { author: 'test' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n', { author: 'test' }));
    expect(editor.scroll.domNode).toEqualHTML('<p data-author="test"><span data-author="test">0123</span></p>');
  });

  it('remove block + inline', function() {
    let editor = this.initialize(Editor, '<p data-author="test">0<span data-author="test">12</span>3</p>');
    editor.formatText(0, 5, { author: false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });
});
