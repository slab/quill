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
});

