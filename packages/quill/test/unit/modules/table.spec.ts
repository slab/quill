import Delta from 'quill-delta';
import Quill from '../../../src/core';
import { describe, expect, test } from 'vitest';
import { createRegistry } from '../__helpers__/factory';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '../../../src/formats/table';
import { normalizeHTML } from '../__helpers__/utils';
import Table from '../../../src/modules/table';

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
});
