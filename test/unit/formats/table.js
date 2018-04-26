import Delta from 'quill-delta';
import Editor from '../../../core/editor';

const tableDelta = new Delta()
  .insert('A1')
  .insert('\n', { table: { row: 'a' } })
  .insert('A2')
  .insert('\n', { table: { row: 'a' } })
  .insert('A3')
  .insert('\n', { table: { row: 'a' } })
  .insert('B1')
  .insert('\n', { table: { row: 'b' } })
  .insert('B2')
  .insert('\n', { table: { row: 'b' } })
  .insert('B3')
  .insert('\n', { table: { row: 'b' } })
  .insert('C1')
  .insert('\n', { table: { row: 'c' } })
  .insert('C2')
  .insert('\n', { table: { row: 'c' } })
  .insert('C3')
  .insert('\n', { table: { row: 'c' } });

const tableHTML = `
  <table contenteditable="false">
    <tbody>
      <tr>
        <td data-row="a" contenteditable="true">A1</td>
        <td data-row="a" contenteditable="true">A2</td>
        <td data-row="a" contenteditable="true">A3</td>
      </tr>
      <tr>
        <td data-row="b" contenteditable="true">B1</td>
        <td data-row="b" contenteditable="true">B2</td>
        <td data-row="b" contenteditable="true">B3</td>
      </tr>
      <tr>
        <td data-row="c" contenteditable="true">C1</td>
        <td data-row="c" contenteditable="true">C2</td>
        <td data-row="c" contenteditable="true">C3</td>
      </tr>
    </tbody>
  </table>`;

describe('Table', function() {
  it('initialize', function() {
    const editor = this.initialize(Editor, tableHTML);
    expect(editor.getDelta()).toEqual(tableDelta);
    expect(this.container).toEqualHTML(tableHTML);
  });

  it('add', function() {
    const editor = this.initialize(Editor, '');
    editor.applyDelta(tableDelta.delete(1));
    expect(this.container).toEqualHTML(tableHTML);
  });

  it('add format plaintext', function() {
    const editor = this.initialize(Editor, '<p>Test</p>');
    editor.formatLine(0, 5, { table: { row: 'a' } });
    expect(this.container).toEqualHTML(
      '<table contenteditable="false"><tr><td data-row="a" contenteditable="true">Test</td></tr></table>',
    );
  });

  it('add format replace', function() {
    const editor = this.initialize(Editor, '<h1>Test</h1>');
    editor.formatLine(0, 5, { table: { row: 'a' } });
    expect(this.container).toEqualHTML(
      '<table contenteditable="false"><tr><td data-row="a" contenteditable="true">Test</td></tr></table>',
    );
  });

  it('remove format plaintext', function() {
    const editor = this.initialize(
      Editor,
      '<table><tr><td data-row="a">Test</td></tr></table>',
    );
    editor.formatLine(0, 5, { table: null });
    expect(this.container).toEqualHTML('<p>Test</p>');
  });

  it('remove format replace', function() {
    const editor = this.initialize(
      Editor,
      '<table><tr><td data-row="a">Test</td></tr></table>',
    );
    editor.formatLine(0, 5, { header: 1 });
    expect(this.container).toEqualHTML('<h1>Test</h1>');
  });

  it('group rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr><td data-row="a">A</td></tr>
          <tr><td data-row="a">B</td></tr>
        </tbody>
      </table>
    `,
    );
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(this.container).toEqualHTML(`
      <table>
        <tbody>
          <tr><td data-row="a">A</td><td data-row="a">B</td></tr>
        </tbody>
      </table>
    `);
  });

  it('split rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr><td data-row="a">A</td><td data-row="b">B</td></tr>
        </tbody>
      </table>
    `,
    );
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(this.container).toEqualHTML(`
      <table>
        <tbody>
          <tr><td data-row="a">A</td></tr>
          <tr><td data-row="b">B</td></tr>
        </tbody>
      </table>
    `);
  });

  it('group and split rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr><td data-row="a">A</td><td data-row="b">B1</td></tr>
          <tr><td data-row="b">B2</td></tr>
        </tbody>
      </table>
    `,
    );
    editor.scroll.children.head.children.head.children.head.optimize();
    expect(this.container).toEqualHTML(`
      <table>
        <tbody>
          <tr><td data-row="a">A</td></tr>
          <tr><td data-row="b">B1</td><td data-row="b">B2</td></tr>
        </tbody>
      </table>
    `);
  });

  it('balance cells', function() {
    const editor = this.initialize(
      Editor,
      `<table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="a" contenteditable="true">A1</td>
          </tr>
          <tr>
            <td data-row="b" contenteditable="true">B1</td>
            <td data-row="b" contenteditable="true">B2</td>
          </tr>
          <tr>
            <td data-row="c" contenteditable="true">C1</td>
            <td data-row="c" contenteditable="true">C2</td>
            <td data-row="c" contenteditable="true">C3</td>
          </tr>
        </tbody>
      </table>`,
    );
    editor.scroll.children.head.balanceCells();
    expect(this.container).toEqualHTML(
      `<table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="a" contenteditable="true">A1</td>
            <td data-row="a" contenteditable="true"><br></td>
            <td data-row="a" contenteditable="true"><br></td>
          </tr>
          <tr>
            <td data-row="b" contenteditable="true">B1</td>
            <td data-row="b" contenteditable="true">B2</td>
            <td data-row="b" contenteditable="true"><br></td>
          </tr>
          <tr>
            <td data-row="c" contenteditable="true">C1</td>
            <td data-row="c" contenteditable="true">C2</td>
            <td data-row="c" contenteditable="true">C3</td>
          </tr>
        </tbody>
      </table>`,
    );
  });

  it('format', function() {
    const editor = this.initialize(Editor, '<p>a</p><p>b</p><p>1</p><p>2</p>');
    editor.formatLine(0, 4, { table: { row: 'a' } });
    editor.formatLine(4, 4, { table: { row: 'b' } });
    expect(this.container).toEqualHTML(
      `<table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="a" contenteditable="true">a</td>
            <td data-row="a" contenteditable="true">b</td>
          </tr>
          <tr>
            <td data-row="b" contenteditable="true">1</td>
            <td data-row="b" contenteditable="true">2</td>
          </tr>
        </tbody>
      </table>`,
    );
  });

  it('applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta()
        .insert('\n\n', { table: { row: 'a' } })
        .insert('\n\n', { table: { row: 'b' } }),
    );
    expect(this.container).toEqualHTML(
      `<table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="a" contenteditable="true"><br></td>
            <td data-row="a" contenteditable="true"><br></td>
          </tr>
          <tr>
            <td data-row="b" contenteditable="true"><br></td>
            <td data-row="b" contenteditable="true"><br></td>
          </tr>
        </tbody>
      </table>
      <p><br></p>`,
    );
  });

  it('unbalanced table applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta()
        .insert('A1\nB1\nC1\n', { table: { row: 1 } })
        .insert('A2\nB2\nC2\n', { table: { row: 2 } })
        .insert('A3\nB3\n', { table: { row: 3 } }),
    );
    expect(this.container).toEqualHTML(
      `<table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="1" contenteditable="true">A1</td>
            <td data-row="1" contenteditable="true">B1</td>
            <td data-row="1" contenteditable="true">C1</td>
          </tr>
          <tr>
            <td data-row="2" contenteditable="true">A2</td>
            <td data-row="2" contenteditable="true">B2</td>
            <td data-row="2" contenteditable="true">C2</td>
          </tr>
          <tr>
            <td data-row="3" contenteditable="true">A3</td>
            <td data-row="3" contenteditable="true">B3</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>`,
    );
  });

  it('existing table applyDelta', function() {
    const editor = this.initialize(
      Editor,
      `
      <table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="1" contenteditable="true">A1</td>
          </tr>
          <tr>
            <td data-row="2" contenteditable="true"><br></td>
            <td data-row="2" contenteditable="true">B1</td>
          </tr>
        </tbody>
      </table>`,
    );
    editor.applyDelta(
      new Delta()
        .retain(3)
        .retain(1, { table: { row: 1 } })
        .insert('\n', { table: { row: 2 } }),
    );
    expect(this.container).toEqualHTML(
      `<table contenteditable="false">
        <tbody>
          <tr>
            <td data-row="1" contenteditable="true">A1</td>
            <td data-row="1" contenteditable="true"><br></td>
          </tr>
          <tr>
            <td data-row="2" contenteditable="true"><br></td>
            <td data-row="2" contenteditable="true">B1</td>
          </tr>
        </tbody>
      </table>`,
    );
  });
});
