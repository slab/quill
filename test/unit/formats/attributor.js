import Delta from 'rich-text/lib/delta';
import Editor from '../../../core/editor';


describe('Attributor', function() {
  it('definition', function() {
    let editor = this.initialize(Editor, `
      <p class="ql-direction-rtl ql-align-center">
        <span class="ql-color-red ql-bg-blue ql-font-monospace ql-size-large">0123</span>
      </p>`
    );
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123', { color: 'red', background: 'blue', size: 'large', font: 'monospace' })
      .insert('\n', { direction: 'rtl', align: 'center' })
    );
  });

  it('add inline', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(1, 2, { color:  'red' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0')
      .insert('12', { color: 'red' })
      .insert('3\n')
    );
    expect(this.container.innerHTML).toEqualHTML('<p>0<span class="ql-color-red">12</span>3</p>');
  });

  it('add block', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    editor.formatText(4, 1, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { align: 'center' })
    );
    expect(this.container.innerHTML).toEqualHTML('<p class="ql-align-center">0123</p>');
  });

  it('removal', function() {
    let editor = this.initialize(Editor, '<p class="ql-align-center">0123</p>');
    editor.formatText(4, 1, { align: false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(this.container.innerHTML).toEqualHTML('<p>0123</p>');
  });

  it('whitelist', function() {
    let editor = this.initialize(Editor, '<p class="ql-align-center">0123</p>')
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(4, 1, { align: 'middle' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { align: 'center' })
    );
    expect(this.container.innerHTML).toEqualHTML(initial);
  });

  it('invalid inline scope', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(4, 1, { color: 'red' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(this.container.innerHTML).toEqualHTML(initial);
  });

  it('invalid block scope', function() {
    let editor = this.initialize(Editor, '<p>0123</p>');
    let initial = editor.scroll.domNode.innerHTML;
    editor.formatText(1, 2, { align: 'center' });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(this.container.innerHTML).toEqualHTML(initial);
  })
});
