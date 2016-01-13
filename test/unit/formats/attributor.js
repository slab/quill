import Delta from 'rich-text/lib/delta';
import Editor from '../../../src/editor';


describe('Attributor', function() {
  it('definition', function() {
    let editor = this.initialize(Editor, `
      <p style="direction: rtl; text-align: center;">
        <span style="color: red; background-color: blue; font-size: 32px; font-family: monospace;">0123</span>
      </p>`
    );
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123', { color: 'red', background: 'blue', size: '32px', font: 'monospace' })
      .insert('\n', { direction: 'rtl', align: 'center' })
    );
  });

  it('add inline', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(1, 3, { color:  'red' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { color: 'red' })
      .insert('3\n')
    );
    expect(this.container.innerHTML).toEqualHTML('<p>0<span style="color: red;">12</span>3</p>');
  });

  it('add block', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(4, 5, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { align: 'center' })
    );
    expect(this.container.innerHTML).toEqualHTML('<p style="text-align: center;">0123</p>');
  });

  it('removal', function() {
    let editor = this.initialize(Editor, '<p style="text-align: center;">0123</p>');
    editor.formatText(4, 5, { align: false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(this.container.innerHTML).toEqualHTML('<p>0123</p>');
  });

  it('whitelist', function() {
    let editor = this.initialize(Editor, '<p style="text-align: center;">0123</p>')
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(4, 5, { align: 'middle' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { align: 'center' })
    );
    expect(this.container.innerHTML).toEqualHTML(initial);
  });

  it('invalid inline scope', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(4, 5, { color: 'red' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(this.container.innerHTML).toEqualHTML(initial);
  });

  it('invalid block scope', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(1, 3, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(this.container.innerHTML).toEqualHTML(initial);
  })
});
