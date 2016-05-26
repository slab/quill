import Parchment from 'parchment';
import Delta from 'rich-text/lib/delta';
import Editor from '../../../core/editor';
import CodeBlock from '../../../formats/code';


describe('Code', function() {
  beforeEach(function() {
    Parchment.register(CodeBlock);
  });

  it('add', function() {
    let editor = this.initialize(Editor, '<p><em>0123</em></p><p>5678</p>');
    editor.formatLine(2, 5, { 'code-block': true });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123').insert('\n', { 'code-block': true })
      .insert('5678').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre spellcheck="false">0123</pre><pre spellcheck="false">5678</pre>');
  });

  it('remove', function() {
    let editor = this.initialize(Editor, '<pre>0123</pre>');
    editor.formatText(4, 1, { 'code-block': false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });

  it('replace', function() {
    let editor = this.initialize(Editor, '<pre>0123</pre>');
    editor.formatText(4, 1, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { header: 1 }));
    expect(editor.scroll.domNode).toEqualHTML('<h1>0123</h1>');
  });

  it('ignore formatAt', function() {
    let editor = this.initialize(Editor, '<pre>0123</pre>');
    editor.formatText(1, 1, { bold: true });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { 'code-block': true }));
    expect(editor.scroll.domNode).toEqualHTML('<pre>0123</pre>');
  });
});
