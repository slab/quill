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
    editor.applyDelta(tableDelta.delete(1));
    expect(this.container).toEqualHTML(tableHTML);
  });

  it('add format plaintext', function() {
    const editor = this.initialize(Editor, '<p>Test</p>');
    editor.formatLine(0, 5, { table: { row: 'a' } });
    expect(this.container).toEqualHTML(
      '<table><tr><td data-row="a">Test</td></tr></table>',
    );
  });

  it('add format replace', function() {
    const editor = this.initialize(Editor, '<h1>Test</h1>');
    editor.formatLine(0, 5, { table: { row: 'a' } });
    expect(this.container).toEqualHTML(
      '<table><tr><td data-row="a">Test</td></tr></table>',
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
});
