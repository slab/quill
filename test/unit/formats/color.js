import Delta from 'quill-delta';
import Editor from '../../../core/editor';


describe('Color', function() {
  it('add', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(1, 2, { color:  'red' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { color: 'red' })
      .insert('3\n')
    );
    expect(editor.scroll.domNode).toEqualHTML('<p>0<span style="color: red;">12</span>3</p>');
  });

  it('remove', function() {
    let editor = this.initialize(Editor, '<p>0<strong style="color: red;">12</strong>3</p>');
    editor.formatText(1, 2, { color: false });
    let delta = new Delta().insert('0').insert('12', { bold: true }).insert('3\n');
    expect(editor.getDelta()).toEqual(delta);
    expect(editor.scroll.domNode).toEqualHTML('<p>0<strong>12</strong>3</p>');
  });

  it('remove unwrap', function() {
    let editor = this.initialize(Editor, '<p>0<span style="color: red;">12</span>3</p>');
    editor.formatText(1, 2, { color: false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });

  it('invalid scope', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(4, 1, { color: 'red' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML(initial);
  });
});
