import Delta from 'quill-delta';
import Editor from '../../../core/editor';

describe('Code', function() {
  it('format newline', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.formatLine(0, 1, { 'code-block': true });
    expect(editor.scroll.domNode).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block"><br></div>
      </div>`,
    );
  });

  it('format lines', function() {
    const editor = this.initialize(Editor, '<p><em>0123</em></p><p>5678</p>');
    editor.formatLine(2, 5, { 'code-block': true });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { 'code-block': true })
        .insert('5678')
        .insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">0123</div>
        <div class="ql-code-block">5678</div>
      </div>`,
    );
  });

  it('remove format', function() {
    const editor = this.initialize(
      Editor,
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">0123</div></div>',
    );
    editor.formatText(4, 1, { 'code-block': false });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n'));
    expect(editor.scroll.domNode).toEqualHTML('<p>0123</p>');
  });

  it('delete last', function() {
    const editor = this.initialize(
      Editor,
      '<p>0123</p><div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block"><br></div></div><p>5678</p>',
    );
    editor.deleteText(4, 1);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { 'code-block': true })
        .insert('5678\n'),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">0123</div></div><p>5678</p>',
    );
  });

  it('delete merge before', function() {
    const editor = this.initialize(
      Editor,
      '<h1>0123</h1><div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">4567</div></div>',
    );
    editor.deleteText(4, 1);
    expect(editor.getDelta()).toEqual(
      new Delta().insert('01234567').insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">01234567</div></div>',
    );
  });

  it('delete merge after', function() {
    const editor = this.initialize(
      Editor,
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">0123</div></div><h1>4567</h1>',
    );
    editor.deleteText(4, 1);
    expect(editor.getDelta()).toEqual(
      new Delta().insert('01234567').insert('\n', { header: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML('<h1>01234567</h1>');
  });

  it('delete across before partial merge', function() {
    const editor = this.initialize(
      Editor,
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">34</div>
        <div class="ql-code-block">67</div>
      </div>
      <h1>90</h1>`,
    );
    editor.deleteText(7, 3);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('01')
        .insert('\n', { 'code-block': true })
        .insert('34')
        .insert('\n', { 'code-block': true })
        .insert('60')
        .insert('\n', { header: 1 }),
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">34</div>
      </div>
      <h1>60</h1>`,
    );
  });

  it('delete across before no merge', function() {
    const editor = this.initialize(
      Editor,
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">34</div>
      </div>
      <h1>6789</h1>`,
    );
    editor.deleteText(3, 5);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('01')
        .insert('\n', { 'code-block': true })
        .insert('89')
        .insert('\n', { header: 1 }),
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">01</div></div><h1>89</h1>',
    );
  });

  it('delete across after', function() {
    const editor = this.initialize(
      Editor,
      `<h1>0123</h1>
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">56</div>
        <div class="ql-code-block">89</div>
      </div>`,
    );
    editor.deleteText(2, 4);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('016')
        .insert('\n', { 'code-block': true })
        .insert('89')
        .insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(`
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">016</div>
        <div class="ql-code-block">89</div>
      </div>
    `);
  });

  it('replace', function() {
    const editor = this.initialize(
      Editor,
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">0123</div></div>',
    );
    editor.formatText(4, 1, { header: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { header: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML('<h1>0123</h1>');
  });

  it('replace multiple', function() {
    const editor = this.initialize(
      Editor,
      `
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">23</div>
      </div>
    `,
    );
    editor.formatText(0, 6, { header: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('01')
        .insert('\n', { header: 1 })
        .insert('23')
        .insert('\n', { header: 1 }),
    );
    expect(editor.scroll.domNode).toEqualHTML('<h1>01</h1><h1>23</h1>');
  });

  it('format imprecise bounds', function() {
    const editor = this.initialize(
      Editor,
      `
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">23</div>
        <div class="ql-code-block">45</div>
      </div>
    `,
    );
    editor.formatText(1, 6, { header: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('01')
        .insert('\n', { header: 1 })
        .insert('23')
        .insert('\n', { header: 1 })
        .insert('45')
        .insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(
      '<h1>01</h1><h1>23</h1><div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">45</div></div>',
    );
  });

  it('format without newline', function() {
    const editor = this.initialize(
      Editor,
      `
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">23</div>
        <div class="ql-code-block">45</div>
      </div>
    `,
    );
    editor.formatText(3, 1, { header: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('01')
        .insert('\n', { 'code-block': true })
        .insert('23')
        .insert('\n', { 'code-block': true })
        .insert('45')
        .insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(`
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">23</div>
        <div class="ql-code-block">45</div>
      </div>
    `);
  });

  it('format line', function() {
    const editor = this.initialize(
      Editor,
      `
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
        <div class="ql-code-block">23</div>
        <div class="ql-code-block">45</div>
      </div>
    `,
    );
    editor.formatLine(3, 1, { header: 1 });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('01')
        .insert('\n', { 'code-block': true })
        .insert('23')
        .insert('\n', { header: 1 })
        .insert('45')
        .insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(`
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">01</div>
      </div>
      <h1>23</h1>
      <div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">45</div>
      </div>
    `);
  });

  it('ignore formatAt', function() {
    const editor = this.initialize(
      Editor,
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">0123</div></div>',
    );
    editor.formatText(1, 1, { bold: true });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { 'code-block': true }),
    );
    expect(editor.scroll.domNode).toEqualHTML(
      '<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">0123</div></div>',
    );
  });

  it('partial block modification applyDelta', function() {
    const editor = this.initialize(
      Editor,
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">a</div>
        <div class="ql-code-block">b</div>
        <div class="ql-code-block"><br></div>
      </div>`,
    );
    const delta = new Delta()
      .retain(3)
      .insert('\n', { 'code-block': true })
      .delete(1)
      .retain(1, { 'code-block': null });
    editor.applyDelta(delta);
    expect(editor.scroll.domNode.innerHTML).toEqualHTML(
      `<div class="ql-code-block-container" spellcheck="false">
        <div class="ql-code-block">a</div>
        <div class="ql-code-block">b</div>
      </div>
      <p><br></p>`,
    );
  });
});
