import Parchment from 'parchment';
import Delta from 'quill-delta';
import Editor from '../../../core/editor';
import CodeBlock from '../../../formats/code';


describe('Code', function() {
  beforeEach(function() {
    Parchment.register(CodeBlock);
  });

  it('newline', function() {
    let editor = this.initialize(Editor, `
      <pre></pre>
      <p><br></p>
      <pre>\n</pre>
      <p><br></p>
      <pre>\n\n</pre>
      <p><br></p>
    `);
    expect(editor.scroll.domNode).toEqualHTML(`
      <pre>\n</pre>
      <p><br></p>
      <pre>\n</pre>
      <p><br></p>
      <pre>\n\n</pre>
      <p><br></p>
    `);
  });

  it('default child', function() {
    let editor = this.initialize(Editor, '<p><br></p>');
    editor.formatLine(0, 1, { 'code-block': true });
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre spellcheck="false">\n</pre>');
  });

  it('merge', function() {
    let editor = this.initialize(Editor, `
      <pre>0</pre>
      <pre>0</pre>
      <p><br></p>
      <pre>0</pre>
      <pre>1\n</pre>
      <p><br></p>
      <pre>0</pre>
      <pre>2\n\n</pre>
      <p><br></p>
      <pre>1\n</pre>
      <pre>0</pre>
      <p><br></p>
      <pre>1\n</pre>
      <pre>1\n</pre>
      <p><br></p>
      <pre>1\n</pre>
      <pre>2\n\n</pre>
      <p><br></p>
      <pre>2\n\n</pre>
      <pre>0</pre>
      <p><br></p>
      <pre>2\n\n</pre>
      <pre>1\n</pre>
      <p><br></p>
      <pre>2\n\n</pre>
      <pre>2\n\n</pre>
    `);
    editor.scroll.lines().forEach(function(line) {
      line.optimize();
    })
    expect(editor.scroll.domNode).toEqualHTML(`
      <pre>0\n0\n</pre>
      <p><br></p>
      <pre>0\n1\n</pre>
      <p><br></p>
      <pre>0\n2\n\n</pre>
      <p><br></p>
      <pre>1\n0\n</pre>
      <p><br></p>
      <pre>1\n1\n</pre>
      <p><br></p>
      <pre>1\n2\n\n</pre>
      <p><br></p>
      <pre>2\n\n0\n</pre>
      <p><br></p>
      <pre>2\n\n1\n</pre>
      <p><br></p>
      <pre>2\n\n2\n\n</pre>
    `);
  });

  it('merge multiple', function() {
    let editor = this.initialize(Editor, `
      <pre>0</pre>
      <pre>1</pre>
      <pre>2</pre>
      <pre>3</pre>
    `);
    editor.scroll.children.head.optimize();
    expect(editor.scroll.domNode).toEqualHTML(`
      <pre>0\n1\n2\n3\n</pre>
    `);
  });

  it('add', function() {
    let editor = this.initialize(Editor, '<p><em>0123</em></p><p>5678</p>');
    editor.formatLine(2, 5, { 'code-block': true });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123').insert('\n', { 'code-block': true })
      .insert('5678').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre spellcheck="false">0123\n5678\n</pre>');
  });

  it('remove', function() {
    let editor = this.initialize(Editor, { html: '<pre>0123\n</pre>' });
    editor.formatText(4, 1, { 'code-block': false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });

  it('delete merge before', function() {
    let editor = this.initialize(Editor, { html: '<h1>0123</h1><pre>4567\n</pre>' });
    editor.deleteText(4, 1);
    expect(editor.getDelta()).toEqual(new Delta().insert('01234567').insert('\n', { 'code-block': true }));
    expect(editor.scroll.domNode).toEqualHTML('<pre>01234567\n</pre>');
  });

  it('delete merge after', function() {
    let editor = this.initialize(Editor, { html: '<pre>0123\n</pre><h1>4567</h1>' });
    editor.deleteText(4, 1);
    expect(editor.getDelta()).toEqual(new Delta().insert('01234567').insert('\n', { header: 1 }));
    expect(editor.scroll.domNode).toEqualHTML('<h1>01234567</h1>');
  });

  it('replace', function() {
    let editor = this.initialize(Editor, { html: '<pre>0123\n</pre>' });
    editor.formatText(4, 1, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { header: 1 }));
    expect(editor.scroll.domNode).toEqualHTML('<h1>0123</h1>');
  });

  it('replace multiple', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n23\n</pre>' });
    editor.formatText(0, 6, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { header: 1 })
      .insert('23').insert('\n', { header: 1 })
    );
    expect(editor.scroll.domNode).toEqualHTML('<h1>01</h1><h1>23</h1>');
  });

  it('format interior line', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n23\n45\n</pre>' });
    editor.formatText(5, 1, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { 'code-block': true })
      .insert('23').insert('\n', { 'header': 1 })
      .insert('45').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>01\n</pre><h1>23</h1><pre>45\n</pre>');
  });

  it('format imprecise bounds', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n23\n45\n</pre>' });
    editor.formatText(1, 6, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { 'header': 1 })
      .insert('23').insert('\n', { 'header': 1 })
      .insert('45').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqual('<h1>01</h1><h1>23</h1><pre>45\n</pre>');
  });

  it('format without newline', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n23\n45\n</pre>' });
    editor.formatText(3, 1, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { 'code-block': true })
      .insert('23').insert('\n', { 'code-block': true })
      .insert('45').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>01\n23\n45\n</pre>');
  });

  it('format line', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n23\n45\n</pre>' });
    editor.formatLine(3, 1, { 'header': 1 });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { 'code-block': true })
      .insert('23').insert('\n', { 'header': 1 })
      .insert('45').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>01\n</pre><h1>23</h1><pre>45\n</pre>');
  });

  it('ignore formatAt', function() {
    let editor = this.initialize(Editor, '<pre>0123</pre>');
    editor.formatText(1, 1, { bold: true });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { 'code-block': true }));
    expect(editor.scroll.domNode).toEqualHTML('<pre>0123</pre>');
  });
});
