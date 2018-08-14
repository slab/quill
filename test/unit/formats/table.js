import Delta from 'quill-delta';
import Editor from '../../../core/editor';

const tableDelta = new Delta()
  .insert('A1')
  .insert('\n', { table: 'a' })
  .insert('A2')
  .insert('\n', { table: 'a' })
  .insert('A3')
  .insert('\n', { table: 'a' })
  .insert('B1')
  .insert('\n', { table: 'b' })
  .insert('B2')
  .insert('\n', { table: 'b' })
  .insert('B3')
  .insert('\n', { table: 'b' })
  .insert('C1')
  .insert('\n', { table: 'c' })
  .insert('C2')
  .insert('\n', { table: 'c' })
  .insert('C3')
  .insert('\n', { table: 'c' });

const tableHTML = `
  <table>
    <tbody>
      <tr>
        <td data-row="a">A1</td>
        <td data-row="a">A2</td>
        <td data-row="a">A3</td>
      </tr>
      <tr>
        <td data-row="b">B1</td>
        <td data-row="b">B2</td>
        <td data-row="b">B3</td>
      </tr>
      <tr>
        <td data-row="c">C1</td>
        <td data-row="c">C2</td>
        <td data-row="c">C3</td>
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
    editor.applyDelta(new Delta([...tableDelta.ops]).delete(1));
    expect(this.container).toEqualHTML(tableHTML);
  });

  it('add format plaintext', function() {
    const editor = this.initialize(Editor, '<p>Test</p>');
    editor.formatLine(0, 5, { table: 'a' });
    expect(this.container).toEqualHTML(
      '<table><tbody><tr><td data-row="a">Test</td></tr></tbody></table>',
    );
  });

  it('add format replace', function() {
    const editor = this.initialize(Editor, '<h1>Test</h1>');
    editor.formatLine(0, 5, { table: 'a' });
    expect(this.container).toEqualHTML(
      '<table><tbody><tr><td data-row="a">Test</td></tr></tbody></table>',
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

  xit('group and split multiple rows', function() {
    const editor = this.initialize(
      Editor,
      `
      <table>
        <tbody>
          <tr><td data-row="1"><br></td><td data-row="1"><br></td><td data-row="1"><br></td></tr>
          <tr><td data-row="2"><br></td><td data-row="2"><br></td><td data-row="2"><br></td></tr>
          <tr><td data-row="3"><br></td><td data-row="3"><br></td></tr>
          <tr><td data-row="3"><br></td><td data-row="4"><br></td></tr>
          <tr><td data-row="4"><br></td><td data-row="4"><br></td></tr>
        </tbody>
      </table>
    `,
    );
    editor.scroll.children.head.children.head.optimize();
    expect(this.container).toEqualHTML(`
      <table>
        <tbody>
          <tr><td data-row="1"><br></td><td data-row="1"><br></td><td data-row="1"><br></td></tr>
          <tr><td data-row="2"><br></td><td data-row="2"><br></td><td data-row="2"><br></td></tr>
          <tr><td data-row="3"><br></td><td data-row="3"><br></td><td data-row="3"><br></td></tr>
          <tr><td data-row="4"><br></td><td data-row="4"><br></td><td data-row="4"><br></td></tr>
        </tbody>
      </table>
    `);
  });

  it('balance cells', function() {
    const editor = this.initialize(
      Editor,
      `<table>
        <tbody>
          <tr>
            <td data-row="a">A1</td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
          </tr>
          <tr>
            <td data-row="c">C1</td>
            <td data-row="c">C2</td>
            <td data-row="c">C3</td>
          </tr>
        </tbody>
      </table>`,
    );
    editor.scroll.children.head.balanceCells();
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="a">A1</td>
            <td data-row="a"><br></td>
            <td data-row="a"><br></td>
          </tr>
          <tr>
            <td data-row="b">B1</td>
            <td data-row="b">B2</td>
            <td data-row="b"><br></td>
          </tr>
          <tr>
            <td data-row="c">C1</td>
            <td data-row="c">C2</td>
            <td data-row="c">C3</td>
          </tr>
        </tbody>
      </table>`,
    );
  });

  it('format', function() {
    const editor = this.initialize(Editor, '<p>a</p><p>b</p><p>1</p><p>2</p>');
    editor.formatLine(0, 4, { table: 'a' });
    editor.formatLine(4, 4, { table: 'b' });
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="a">a</td>
            <td data-row="a">b</td>
          </tr>
          <tr>
            <td data-row="b">1</td>
            <td data-row="b">2</td>
          </tr>
        </tbody>
      </table>`,
    );
  });

  it('applyDelta', function() {
    const editor = this.initialize(Editor, '<p><br></p>');
    editor.applyDelta(
      new Delta().insert('\n\n', { table: 'a' }).insert('\n\n', { table: 'b' }),
    );
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="a"><br></td>
            <td data-row="a"><br></td>
          </tr>
          <tr>
            <td data-row="b"><br></td>
            <td data-row="b"><br></td>
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
        .insert('A1\nB1\nC1\n', { table: '1' })
        .insert('A2\nB2\nC2\n', { table: '2' })
        .insert('A3\nB3\n', { table: '3' }),
    );
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
            <td data-row="1">B1</td>
            <td data-row="1">C1</td>
          </tr>
          <tr>
            <td data-row="2">A2</td>
            <td data-row="2">B2</td>
            <td data-row="2">C2</td>
          </tr>
          <tr>
            <td data-row="3">A3</td>
            <td data-row="3">B3</td>
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
      <table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
          </tr>
          <tr>
            <td data-row="2"><br></td>
            <td data-row="2">B1</td>
          </tr>
        </tbody>
      </table>`,
    );
    editor.applyDelta(
      new Delta()
        .retain(3)
        .retain(1, { table: '1' })
        .insert('\n', { table: '2' }),
    );
    expect(this.container).toEqualHTML(
      `<table>
        <tbody>
          <tr>
            <td data-row="1">A1</td>
            <td data-row="1"><br></td>
          </tr>
          <tr>
            <td data-row="2"><br></td>
            <td data-row="2">B1</td>
          </tr>
        </tbody>
      </table>`,
    );
  });
});
