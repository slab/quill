import Delta from 'quill-delta';
import Editor from '../../../core/editor';


describe('Code', function() {
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

  it('delete last', function() {
    let editor = this.initialize(Editor, { html: '<p>0123</p><pre>\n</pre><p>5678</p>' });
    editor.deleteText(4, 1);
    expect(editor.getDelta()).toEqual(new Delta().insert('0123').insert('\n', { 'code-block': true }).insert('5678\n'));
    expect(editor.scroll.domNode).toEqualHTML('<pre>0123</pre><p>5678</p>');
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

  it('delete across before partial merge', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n34\n67\n</pre><h1>90</h1>' });
    editor.deleteText(7, 3);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { 'code-block': true })
      .insert('34').insert('\n', { 'code-block': true })
      .insert('60').insert('\n', { header: 1 })
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML('<pre>01\n34\n</pre><h1>60</h1>');
  });

  it('delete across before no merge', function() {
    let editor = this.initialize(Editor, { html: '<pre>01\n34\n</pre><h1>6789</h1>' });
    editor.deleteText(3, 5);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('01').insert('\n', { 'code-block': true })
      .insert('89').insert('\n', { header: 1 })
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML('<pre>01\n</pre><h1>89</h1>');
  });

  it('delete across after', function() {
    let editor = this.initialize(Editor, { html: '<h1>0123</h1><pre>56\n89\n</pre>' });
    editor.deleteText(2, 4);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('016').insert('\n', { 'code-block': true })
      .insert('89').insert('\n', { 'code-block': true })
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML('<pre>016\n89\n</pre>');
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

  it('partial block modification applyDelta', function() {
    let editor = this.initialize(Editor, { html: '<pre>a\nb\n\n</pre>' });
    let delta = new Delta()
      .retain(3)
      .insert('\n', { 'code-block': true })
      .delete(1)
      .retain(1, { 'code-block': null });
    editor.applyDelta(delta);
    expect(editor.scroll.domNode.innerHTML).toEqual('<pre>a\nb\n</pre><p><br></p>');
  });
});
