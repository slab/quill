import Delta from 'quill-delta';
import Editor from '../../../core/editor';


describe('List', function() {
  it('add', function() {
    let editor = this.initialize(Editor, `
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>`
    );
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123\n5678')
      .insert('\n', { list: 'ordered' })
      .insert('0123\n')
    );
    expect(this.container).toEqualHTML(`
      <p>0123</p>
      <ol><li>5678</li></ol>
      <p>0123</p>
    `);
  });

  it('checklist', function() {
    let editor = this.initialize(Editor, `
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>
    `);
    editor.scroll.domNode.classList.add('ql-editor');
    editor.formatText(4, 1, { list: 'checked' });
    editor.formatText(9, 1, { list: 'unchecked' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'checked' })
      .insert('5678')
      .insert('\n', { list: 'unchecked' })
      .insert('0123\n')
    );
    expect(this.container).toEqualHTML(`
      <ul data-checked="true">
        <li>0123</li>
      </ul>
      <ul data-checked="false">
        <li>5678</li>
      </ul>
      <p>0123</p>
    `);
  });

  it('remove', function() {
    let editor = this.initialize(Editor, `
      <p>0123</p>
      <ol><li>5678</li></ol>
      <p>0123</p>
    `);
    editor.formatText(9, 1, { list: null });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n5678\n0123\n'));
    expect(this.container).toEqualHTML(`
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>
    `);
  });

  it('replace', function() {
    let editor = this.initialize(Editor, `
      <p>0123</p>
      <ol><li>5678</li></ol>
      <p>0123</p>
    `);
    editor.formatText(9, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123\n5678')
      .insert('\n', { list: 'bullet' })
      .insert('0123\n')
    );
    expect(this.container).toEqualHTML(`
      <p>0123</p>
      <ul><li>5678</li></ul>
      <p>0123</p>
    `);
  });

  it('replace checklist with bullet', function() {
    let editor = this.initialize(Editor, `
      <ul data-checked="true">
        <li>0123</li>
      </ul>
    `);
    editor.formatText(4, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'bullet' })
    );
    expect(this.container).toEqualHTML(`
      <ul><li>0123</li></ul>
    `);
  });

  it('replace with attributes', function() {
    let editor = this.initialize(Editor, '<ol><li class="ql-align-center">0123</li></ol>');
    editor.formatText(4, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123').insert('\n', { align: 'center', list: 'bullet' })
    );
    expect(this.container).toEqualHTML('<ul><li class="ql-align-center">0123</li></ul>');
  });

  it('format merge', function() {
    let editor = this.initialize(Editor, `
      <ol><li>0123</li></ol>
      <p>5678</p>
      <ol><li>0123</li></ol>
    `);
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'ordered' })
      .insert('5678')
      .insert('\n', { list: 'ordered' })
      .insert('0123')
      .insert('\n', { list: 'ordered' })
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('replace merge', function() {
    let editor = this.initialize(Editor, `
      <ol><li>0123</li></ol>
      <ul><li>5678</li></ul>
      <ol><li>0123</li></ol>`
    );
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'ordered' })
      .insert('5678')
      .insert('\n', { list: 'ordered' })
      .insert('0123')
      .insert('\n', { list: 'ordered' })
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('delete merge', function() {
    let editor = this.initialize(Editor, `
      <ol><li>0123</li></ol>
      <p>5678</p>
      <ol><li>0123</li></ol>`
    );
    editor.deleteText(5, 5);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'ordered' })
      .insert('0123')
      .insert('\n', { list: 'ordered' })
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li>0123</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('merge checklist', function() {
    let editor = this.initialize(Editor, `
      <ul data-checked="true"><li>0123</li></ul>
      <p>5678</p>
      <ul data-checked="true"><li>0123</li></ul>
    `);
    editor.formatText(9, 1, { list: 'checked' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'checked' })
      .insert('5678')
      .insert('\n', { list: 'checked' })
      .insert('0123')
      .insert('\n', { list: 'checked' })
    );
    expect(this.container).toEqualHTML(`
      <ul data-checked="true">
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ul>`
    );
  });

  it('replace split', function() {
    let editor = this.initialize(Editor, `
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
    editor.formatText(9, 1,  { list: 'bullet' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'ordered' })
      .insert('5678')
      .insert('\n', { list: 'bullet' })
      .insert('0123')
      .insert('\n', { list: 'ordered' })
    );
    expect(this.container).toEqualHTML(`
      <ol><li>0123</li></ol>
      <ul><li>5678</li></ul>
      <ol><li>0123</li></ol>`
    );
  });

  it('split checklist', function() {
    let editor = this.initialize(Editor, `
      <ul>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ul>`
    );
    editor.formatText(9, 1,  { list: 'unchecked' });
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: 'bullet' })
      .insert('5678')
      .insert('\n', { list: 'unchecked' })
      .insert('0123')
      .insert('\n', { list: 'bullet' })
    );
    expect(this.container).toEqualHTML(`
      <ul><li>0123</li></ul>
      <ul data-checked="false"><li>5678</li></ul>
      <ul><li>0123</li></ul>`
    );
  });

  it('empty line interop', function() {
    let editor = this.initialize(Editor, '<ol><li><br></li></ol>');
    editor.insertText(0, 'Test');
    expect(this.container).toEqualHTML('<ol><li>Test</li></ol>');
    editor.deleteText(0, 4);
    expect(this.container).toEqualHTML('<ol><li><br></li></ol>');
  });

  it('delete multiple items', function() {
    let editor = this.initialize(Editor, `
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
    editor.deleteText(2, 5);
    expect(this.container).toEqualHTML(`
      <ol>
        <li>0178</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('delete across last item', function() {
    let editor = this.initialize(Editor, `
      <ol><li>0123</li></ol>
      <p>5678</p>`
    );
    editor.deleteText(2, 5);
    expect(this.container).toEqualHTML('<p>0178</p>');
  });

  it('delete partial', function() {
    let editor = this.initialize(Editor, '<p>0123</p><ul><li>5678</li></ul>');
    editor.deleteText(2, 5);
    expect(this.container).toEqualHTML('<ul><li>0178</li></ul>');
  });

  it('nested list replacement', function() {
    let editor = this.initialize(Editor, `
      <ol>
        <li>One</li>
        <li class='ql-indent-1'>Alpha</li>
        <li>Two</li>
      </ol>
    `);
    editor.formatLine(1, 10, { list: 'bullet' });
    expect(this.container).toEqualHTML(`
      <ul>
        <li>One</li>
        <li class='ql-indent-1'>Alpha</li>
        <li>Two</li>
      </ul>
    `);
  });

  it('copy atttributes', function() {
    let editor = this.initialize(Editor, '<p class="ql-align-center">Test</p>');
    editor.formatLine(4, 1, { list: 'bullet' });
    expect(this.container).toEqualHTML('<ul><li class="ql-align-center">Test</li></ul>');
  });

  it('insert block embed', function() {
    let editor = this.initialize(Editor, '<ol><li>Test</li></ol>');
    editor.insertEmbed(2, 'video', 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0');
    expect(this.container).toEqualHTML(`
      <ol><li>Te</li></ol>
      <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol><li>st</li></ol>
    `);
  });

  it('insert block embed at beginning', function() {
    let editor = this.initialize(Editor, '<ol><li>Test</li></ol>');
    editor.insertEmbed(0, 'video', 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0');
    expect(this.container).toEqualHTML(`
      <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol><li>Test</li></ol>
    `);
  });

  it('insert block embed at end', function() {
    let editor = this.initialize(Editor, '<ol><li>Test</li></ol>');
    editor.insertEmbed(4, 'video', 'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0');
    expect(this.container).toEqualHTML(`
      <ol><li>Test</li></ol>
      <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol><li><br></li></ol>
    `);
  });
});
