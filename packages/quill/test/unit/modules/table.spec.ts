import Delta from 'quill-delta';
import Quill from '../../../src/core.js';
import { describe, expect, test } from 'vitest';
import { createRegistry } from '../__helpers__/factory.js';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '../../../src/formats/table.js';
import { normalizeHTML } from '../__helpers__/utils.js';
import Table from '../../../src/modules/table.js';

const createQuill = (html: string) => {
  Quill.register({ 'modules/table': Table }, true);
  const container = document.body.appendChild(document.createElement('div'));
  container.innerHTML = normalizeHTML(html);
  const quill = new Quill(container, {
    modules: { table: true },
    registry: createRegistry([TableBody, TableCell, TableContainer, TableRow]),
  });
  return quill;
};

describe('Table Module', () => {
  describe('insert table', () => {
    test('empty', () => {
      const quill = createQuill('<p><br></p>');
      const table = quill.getModule('table') as Table;
      quill.setSelection(0);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
          </tbody>
        </table>
        <p><br></p>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('split', () => {
      const quill = createQuill('<p>0123</p>');
      const table = quill.getModule('table') as Table;
      quill.setSelection(2);
      table.insertTable(2, 3);
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td>01</td><td><br></td><td><br></td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
          </tbody>
        </table>
        <p>23</p>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });
  });

  describe('modify table', () => {
    const setup = () => {
      const tableHTML = `
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `;
      const quill = createQuill(tableHTML);
      const table = quill.getModule('table') as Table;
      return { quill, table };
    };

    test('insertRowAbove', () => {
      const { quill, table } = setup();
      quill.setSelection(0);
      table.insertRowAbove();
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('insertRowBelow', () => {
      const { quill, table } = setup();
      quill.setSelection(0);
      table.insertRowBelow();
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td><br></td><td><br></td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('insertColumnLeft', () => {
      const { quill, table } = setup();
      quill.setSelection(0);
      table.insertColumnLeft();
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td><br></td><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td><br></td><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('insertColumnRight', () => {
      const { quill, table } = setup();
      quill.setSelection(0);
      table.insertColumnRight();
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td>a1</td><td><br></td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td><br></td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('deleteRow', () => {
      const { quill, table } = setup();
      quill.setSelection(0);
      table.deleteRow();
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('deleteColumn', () => {
      const { quill, table } = setup();
      quill.setSelection(0);
      table.deleteColumn();
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td>a2</td><td>a3</td></tr>
            <tr><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('insertText before', () => {
      const { quill } = setup();
      quill.updateContents(new Delta().insert('\n'));
      expect(quill.root).toEqualHTML(
        `
        <p><br></p>
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('insertText after', () => {
      const { quill } = setup();
      quill.updateContents(new Delta().retain(18).insert('\n'));
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr><td>a1</td><td>a2</td><td>a3</td></tr>
            <tr><td>b1</td><td>b2</td><td>b3</td></tr>
          </tbody>
        </table>
        <p><br></p>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });
  });

  describe('className formats', () => {
    const setupWithHtml = (html: string) => {
      Quill.register({ 'modules/table': Table }, true);

      class CustomTableRow extends TableRow {
        static create(value: string) {
          const node = super.create() as HTMLElement;
          if (value) {
            node.className = value;
          }
          return node;
        }

        static formats(domNode: HTMLElement) {
          return domNode.className;
        }

        formats() {
          const formats = CustomTableRow.formats(this.domNode);
          return { [CustomTableRow.blotName]: formats };
        }

        format(name: string, value: string) {
          if (name === CustomTableRow.blotName) {
            if (value == null || value === '') {
              this.domNode.removeAttribute('class');
            } else {
              this.domNode.className = value;
            }
          }
        }
      }

      class CustomTableContainer extends TableContainer {
        static create(value: string) {
          const node = super.create() as HTMLElement;
          if (value) {
            node.className = value;
          }
          return node;
        }

        static formats(domNode: HTMLElement) {
          return domNode.className;
        }

        formats() {
          const formats = CustomTableContainer.formats(this.domNode);
          return { [CustomTableContainer.blotName]: formats };
        }

        format(name: string, value: string) {
          if (name === CustomTableContainer.blotName) {
            if (value == null || value === '') {
              this.domNode.removeAttribute('class');
            } else {
              this.domNode.className = value;
            }
          }
        }
      }

      const container = document.body.appendChild(
        document.createElement('div'),
      );
      container.innerHTML = normalizeHTML(html);
      const quill = new Quill(container, {
        modules: { table: true },
        registry: createRegistry([
          TableBody,
          TableCell,
          CustomTableContainer,
          CustomTableRow,
        ]),
      });
      return quill;
    };

    test('table with class names', () => {
      const quill = setupWithHtml(
        `<table>
          <tbody>
            <tr class="row">
              <td>data</td>
              <td>more data</td>
            </tr>
          </tbody>
        </table>`,
      );
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr class="row">
              <td>data</td>
              <td>more data</td>
            </tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('table with class names varient 2', () => {
      const quill = setupWithHtml(
        `<table class="table">
          <tbody>
            <tr class="custom-row-class">
              <td>data</td>
              <td>more data</td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr class="custom-row-class2">
              <td>data2</td>
              <td>more data2</td>
            </tr>
          </tbody>
        </table>`,
      );
      expect(quill.root).toEqualHTML(
        `
        <table class="table">
          <tbody>
            <tr class="custom-row-class">
              <td>data</td>
              <td>more data</td>
            </tr>
            <tr>
              <td><br></td>
              <td><br></td>
            </tr>
            <tr class="custom-row-class2">
              <td>data2</td>
              <td>more data2</td>
            </tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
      quill.setSelection(0);
      const tableModule = quill.getModule('table') as Table;
      const [, row] = tableModule.getTable();
      const index = row?.length();

      quill.formatLine(index as number, 1, 'table-row', 'new-class-name');
      expect(quill.root).toEqualHTML(
        `
        <table class="table">
          <tbody>
            <tr class="custom-row-class">
              <td>data</td>
              <td>more data</td>
            </tr>
            <tr class="new-class-name">
              <td><br></td>
              <td><br></td>
            </tr>
            <tr class="custom-row-class2">
              <td>data2</td>
              <td>more data2</td>
            </tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
      quill.formatLine(
        0,
        1,
        'table-container',
        'new-table-class other-table-class',
      );
      expect(quill.root).toEqualHTML(
        `
        <table class="new-table-class other-table-class">
          <tbody>
            <tr class="custom-row-class">
              <td>data</td>
              <td>more data</td>
            </tr>
            <tr class="new-class-name">
              <td><br></td>
              <td><br></td>
            </tr>
            <tr class="custom-row-class2">
              <td>data2</td>
              <td>more data2</td>
            </tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
      quill.formatLine(index as number, 1, 'table-container', '');
      expect(quill.root).toEqualHTML(
        `
        <table>
          <tbody>
            <tr class="custom-row-class">
              <td>data</td>
              <td>more data</td>
            </tr>
            <tr class="new-class-name">
              <td><br></td>
              <td><br></td>
            </tr>
            <tr class="custom-row-class2">
              <td>data2</td>
              <td>more data2</td>
            </tr>
          </tbody>
        </table>
      `,
        { ignoreAttrs: ['data-row'] },
      );
    });

    test('table as first line', () => {
      const content = `
        <table class="table">
          <tbody>
            <tr>
              <td data-row="row-4uol">Märkus: Detsembris ei ole Kaarli kirikus palvusi esmaspäeviti, sest kirikus toimuvad kontsertid. Selle asemel palvetame Dominiiklaste kabelis (Müürivahe 33). Ka proov kell 17 sealsamas. Ja 5. jaanuaril 2025 läheb elu edasi Kaarli kirikus.</td>
            </tr>
          </tbody>
        </table>
        <p><br></p>
        <p><br></p>
        <p>Ühispalvus igal esmaspäeval kell 18:00. Enne palvust kell 17:00 lauluproov ja ettevalmistused. Igaüks on teretulnud! Ootame lauljaid juurde!</p>
        <p>Asukoht: Tallinna Kaarli kirik</p>
        <p>Korraldaja: EELK Tallinna Kaarli kogudus</p>
        <p>Kontakt: Annely Neame (5267825)</p>
        <p>N.B.: Juulis, augustis ja detsembris Kaarli kirikus palvusi esmaspäeviti ei ole.</p>`;
      const quill = setupWithHtml(content);
      expect(quill.root.innerHTML).toBe(normalizeHTML(content));
    });

    test.only('updateContents with class names', () => {
      const quill = setupWithHtml('<p><br></p>');
      quill.updateContents(
        new Delta()
          .retain(quill.getLength())
          .insert('\n\n', { table: 'row-lo87' })
          .insert('\n\n', { table: 'row-54yt', 'table-row': 'custom-row' }),
      );
      expect(quill.root.innerHTML).toEqualHTML(
        normalizeHTML(`
        <p>
          <br>
        </p>
        <table>
          <tbody>
            <tr><td><br></td><td><br></td></tr>
            <tr class="custom-row"><td><br></td><td><br></td></tr>
          </tbody>
        </table>
      `),
        { ignoreAttrs: ['data-row'] },
      );
    });
  });
});
