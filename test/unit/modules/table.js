import Delta from 'quill-delta';
import Quill from '../../../core/quill';

describe('Table Module', function() {
  describe('insert table', function() {
    it('empty', function() {
      const quill = this.initialize(Quill, '<p><br></p>', this.container, {
        modules: {
          table: true,
        },
      });
      const table = quill.getModule('table');
      quill.setSelection(0);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
          </tbody>
        </table>
        <p><br></p>
      `);
    });

    it('split', function() {
      const quill = this.initialize(Quill, '<p>0123</p>', this.container, {
        modules: {
          table: true,
        },
      });
      const table = quill.getModule('table');
      quill.setSelection(2);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>01</td><td><br></td><td><br></td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
          </tbody>
        </table>
        <p>23</p>
      `);
    });
  });

  describe('modify table', function() {
    beforeEach(function() {
      const tableHTML = `
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `;
      this.quill = this.initialize(Quill, tableHTML, this.container, {
        modules: {
          table: true,
        },
      });
      this.table = this.quill.getModule('table');
    });

    it('insertRowAbove', function() {
      this.quill.setSelection(0);
      this.table.insertRowAbove();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertRowBelow', function() {
      this.quill.setSelection(0);
      this.table.insertRowBelow();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertColumnLeft', function() {
      this.quill.setSelection(0);
      this.table.insertColumnLeft();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td><br></td><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertColumnRight', function() {
      this.quill.setSelection(0);
      this.table.insertColumnRight();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td><br></td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td><br></td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('deleteRow', function() {
      this.quill.setSelection(0);
      this.table.deleteRow();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('deleteColumn', function() {
      this.quill.setSelection(0);
      this.table.deleteColumn();
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a2</td><td>a3</td></tr>
            <tr><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertText before', function() {
      this.quill.updateContents(new Delta().insert('\n'));
      expect(this.quill.root).toEqualHTML(`
        <p><br></p>
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `);
    });

    it('insertText after', function() {
      this.quill.updateContents(new Delta().retain(18).insert('\n'));
      expect(this.quill.root).toEqualHTML(`
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
        <p><br></p>
      `);
    });
  });
});
