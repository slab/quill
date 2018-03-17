import Delta from 'quill-delta';
import Editor from '../../../core/editor';

describe('List', function() {
  it('add', function() {
    const editor = this.initialize(
      Editor,
      `
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>`,
    );
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123\n5678')
        .insert('\n', { list: 'ordered' })
        .insert('0123\n'),
    );
    expect(this.container).toEqualHTML(`
      <p>0123</p>
      <ol><li data-list="ordered">5678</li></ol>
      <p>0123</p>
    `);
  });

  it('checklist', function() {
    const editor = this.initialize(
      Editor,
      `
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>
    `,
    );
    editor.scroll.domNode.classList.add('ql-editor');
    editor.formatText(4, 1, { list: 'checked' });
    editor.formatText(9, 1, { list: 'unchecked' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'checked' })
        .insert('5678')
        .insert('\n', { list: 'unchecked' })
        .insert('0123\n'),
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li data-list="checked">0123</li>
        <li data-list="unchecked">5678</li>
      </ol>
      <p>0123</p>
    `);
  });

  it('remove', function() {
    const editor = this.initialize(
      Editor,
      `
      <p>0123</p>
      <ol><li data-list="ordered">5678</li></ol>
      <p>0123</p>
    `,
    );
    editor.formatText(9, 1, { list: null });
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n5678\n0123\n'));
    expect(this.container).toEqualHTML(`
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>
    `);
  });

  it('replace', function() {
    const editor = this.initialize(
      Editor,
      `
      <p>0123</p>
      <ol><li data-list="ordered">5678</li></ol>
      <p>0123</p>
    `,
    );
    editor.formatText(9, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123\n5678')
        .insert('\n', { list: 'bullet' })
        .insert('0123\n'),
    );
    expect(this.container).toEqualHTML(`
      <p>0123</p>
      <ol><li data-list="bullet">5678</li></ol>
      <p>0123</p>
    `);
  });

  it('replace checklist with bullet', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol>
        <li data-list="checked">0123</li>
      </ol>
    `,
    );
    editor.formatText(4, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(
      new Delta().insert('0123').insert('\n', { list: 'bullet' }),
    );
    expect(this.container).toEqualHTML(`
      <ol><li data-list="bullet">0123</li></ol>
    `);
  });

  it('replace with attributes', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="ordered" class="ql-align-center">0123</li></ol>',
    );
    editor.formatText(4, 1, { list: 'bullet' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { align: 'center', list: 'bullet' }),
    );
    expect(this.container).toEqualHTML(
      '<ol><li data-list="bullet" class="ql-align-center">0123</li></ol>',
    );
  });

  it('format merge', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol><li data-list="ordered">0123</li></ol>
      <p>5678</p>
      <ol><li data-list="ordered">0123</li></ol>
    `,
    );
    editor.formatText(9, 1, { list: 'ordered' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'ordered' })
        .insert('5678')
        .insert('\n', { list: 'ordered' })
        .insert('0123')
        .insert('\n', { list: 'ordered' }),
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li data-list="ordered">0123</li>
        <li data-list="ordered">5678</li>
        <li data-list="ordered">0123</li>
      </ol>`);
  });

  it('delete merge', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol><li data-list="ordered">0123</li></ol>
      <p>5678</p>
      <ol><li data-list="ordered">0123</li></ol>`,
    );
    editor.deleteText(5, 5);
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'ordered' })
        .insert('0123')
        .insert('\n', { list: 'ordered' }),
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li data-list="ordered">0123</li>
        <li data-list="ordered">0123</li>
      </ol>`);
  });

  it('merge checklist', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol><li data-list="checked">0123</li></ol>
      <p>5678</p>
      <ol><li data-list="checked">0123</li></ol>
    `,
    );
    editor.formatText(9, 1, { list: 'checked' });
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0123')
        .insert('\n', { list: 'checked' })
        .insert('5678')
        .insert('\n', { list: 'checked' })
        .insert('0123')
        .insert('\n', { list: 'checked' }),
    );
    expect(this.container).toEqualHTML(`
      <ol>
        <li data-list="checked">0123</li>
        <li data-list="checked">5678</li>
        <li data-list="checked">0123</li>
      </ol>`);
  });

  it('empty line interop', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="ordered"><br></li></ol>',
    );
    editor.insertText(0, 'Test');
    expect(this.container).toEqualHTML(
      '<ol><li data-list="ordered">Test</li></ol>',
    );
    editor.deleteText(0, 4);
    expect(this.container).toEqualHTML(
      '<ol><li data-list="ordered"><br></li></ol>',
    );
  });

  it('delete multiple items', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol>
        <li data-list="ordered">0123</li>
        <li data-list="ordered">5678</li>
        <li data-list="ordered">0123</li>
      </ol>`,
    );
    editor.deleteText(2, 5);
    expect(this.container).toEqualHTML(`
      <ol>
        <li data-list="ordered">0178</li>
        <li data-list="ordered">0123</li>
      </ol>`);
  });

  it('delete across last item', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol><li data-list="ordered">0123</li></ol>
      <p>5678</p>`,
    );
    editor.deleteText(2, 5);
    expect(this.container).toEqualHTML('<p>0178</p>');
  });

  it('delete partial', function() {
    const editor = this.initialize(
      Editor,
      '<p>0123</p><ol><li data-list="ordered">5678</li></ol>',
    );
    editor.deleteText(2, 5);
    expect(this.container).toEqualHTML(
      '<ol><li data-list="ordered">0178</li></ol>',
    );
  });

  it('nested list replacement', function() {
    const editor = this.initialize(
      Editor,
      `
      <ol>
        <li data-list="bullet">One</li>
        <li data-list="bullet" class='ql-indent-1'>Alpha</li>
        <li data-list="bullet">Two</li>
      </ol>
    `,
    );
    editor.formatLine(1, 10, { list: 'bullet' });
    expect(this.container).toEqualHTML(`
      <ol>
        <li data-list="bullet">One</li>
        <li data-list="bullet" class='ql-indent-1'>Alpha</li>
        <li data-list="bullet">Two</li>
      </ol>
    `);
  });

  it('copy atttributes', function() {
    const editor = this.initialize(
      Editor,
      '<p class="ql-align-center">Test</p>',
    );
    editor.formatLine(4, 1, { list: 'bullet' });
    expect(this.container).toEqualHTML(
      '<ol><li data-list="bullet" class="ql-align-center">Test</li></ol>',
    );
  });

  it('insert block embed', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="ordered">Test</li></ol>',
    );
    editor.insertEmbed(
      2,
      'video',
      'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0',
    );
    expect(this.container).toEqualHTML(`
      <ol><li data-list="ordered">Te</li></ol>
      <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol><li data-list="ordered">st</li></ol>
    `);
  });

  it('insert block embed at beginning', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="ordered">Test</li></ol>',
    );
    editor.insertEmbed(
      0,
      'video',
      'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0',
    );
    expect(this.container).toEqualHTML(`
      <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol><li data-list="ordered">Test</li></ol>
    `);
  });

  it('insert block embed at end', function() {
    const editor = this.initialize(
      Editor,
      '<ol><li data-list="ordered">Test</li></ol>',
    );
    editor.insertEmbed(
      4,
      'video',
      'https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0',
    );
    expect(this.container).toEqualHTML(`
      <ol><li data-list="ordered">Test</li></ol>
      <iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/QHH3iSeDBLo?showinfo=0"></iframe>
      <ol><li data-list="ordered"><br></li></ol>
    `);
  });
});
