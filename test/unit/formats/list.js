import Delta from 'rich-text/lib/delta';
import Editor from '../../../src/editor';


describe('List', function() {
  it('format', function() {
    this.setContainer(`
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>`
    );
    let editor = new Editor(this.container);
    editor.formatAt(9, 1, 'list', true);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123\n5678')
      .insert('\n', { list: true })
      .insert('0123\n')
    );
    expect(this.container.innerHTML).toEqualHTML(`
      <p>0123</p>
      <ol>
        <li>5678</li>
      </ol>
      <p>0123</p>`
    );
  });

  it('remove', function() {
    this.setContainer(`
      <p>0123</p>
      <ol>
        <li>5678</li>
      </ol>
      <p>0123</p>`
    );
    let editor = new Editor(this.container);
    editor.formatAt(9, 1, 'list', false);
    expect(editor.getDelta()).toEqual(new Delta().insert('0123\n5678\n0123\n'));
    expect(this.container.innerHTML).toEqualHTML(`
      <p>0123</p>
      <p>5678</p>
      <p>0123</p>`
    );
  });

  it('replace', function() {
    this.setContainer(`
      <p>0123</p>
      <ol>
        <li>5678</li>
      </ol>
      <p>0123</p>`
    );
    let editor = new Editor(this.container);
    editor.formatAt(9, 1, 'bullet', true);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123\n5678')
      .insert('\n', { bullet: true })
      .insert('0123\n')
    );
    expect(this.container.innerHTML).toEqualHTML(`
      <p>0123</p>
      <ul>
        <li>5678</li>
      </ul>
      <p>0123</p>`
    );
  });

  it('format merge', function() {
    this.setContainer(`
      <ol>
        <li>0123</li>
      </ol>
      <p>5678</p>
      <ol>
        <li>0123</li>
      </ol>`
    );
    let editor = new Editor(this.container);
    editor.formatAt(9, 1, 'list', true);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: true })
      .insert('5678')
      .insert('\n', { list: true })
      .insert('0123')
      .insert('\n', { list: true })
    );
    expect(this.container.innerHTML).toEqualHTML(`
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('replace merge', function() {
    this.setContainer(`
      <ol><li>0123</li></ol>
      <ul><li>5678</li></ul>
      <ol><li>0123</li></ol>`
    );
    let editor = new Editor(this.container);
    editor.formatAt(9, 1, 'list', true);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: true })
      .insert('5678')
      .insert('\n', { list: true })
      .insert('0123')
      .insert('\n', { list: true })
    );
    expect(this.container.innerHTML).toEqualHTML(`
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('delete merge', function() {
    this.setContainer(`
      <ol><li>0123</li></ol>
      <p>5678</p>
      <ol><li>0123</li></ol>`
    );
    let editor = new Editor(this.container);
    editor.deleteAt(5, 5);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: true })
      .insert('0123')
      .insert('\n', { list: true })
    );
    expect(this.container.innerHTML).toEqualHTML(`
      <ol>
        <li>0123</li>
        <li>0123</li>
      </ol>`
    );
  });

  it('replace split', function() {
    this.setContainer(`
      <ol>
        <li>0123</li>
        <li>5678</li>
        <li>0123</li>
      </ol>`
    );
    let editor = new Editor(this.container);
    editor.formatAt(9, 1, 'bullet', true);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert('0123')
      .insert('\n', { list: true })
      .insert('5678')
      .insert('\n', { bullet: true })
      .insert('0123')
      .insert('\n', { list: true })
    );
    expect(this.container.innerHTML).toEqualHTML(`
      <ol><li>0123</li></ol>
      <ul><li>5678</li></ul>
      <ol><li>0123</li></ol>`
    );
  });
});
