import Delta from 'rich-text/lib/delta';
import Editor from '../../../core/editor';
import Table from '../../../formats/table';


describe('Table', function() {
  it('add', function() {
    let editor = this.initialize(Editor, `<p>0123</p>`
    );
    editor.insertEmbed(0, 'table', [['a','b','c'],['d','e','f']]);
    expect(editor.getDelta()).toEqual(new Delta()
      .insert({'table':[['a','b','c'],['d','e','f']]})
      .insert('0123\n')
    );
    expect(this.container).toEqualHTML(`
      <table>
      <tr>
      <td>a</td><td>b</td><td>c</td>
      </tr>
      <tr>
      <td>d</td><td>e</td><td>f</td>
      </tr>
      </table>
      <p>0123</p>
    `);
  });


});
