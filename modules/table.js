import Delta from 'quill-delta';
import Quill from '../core/quill';
import Module from '../core/module';
import {
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  tableId,
} from '../formats/table';

class Table extends Module {
  static register() {
    Quill.register(TableCell);
    Quill.register(TableRow);
    Quill.register(TableBody);
    Quill.register(TableContainer);
  }

  constructor(...args) {
    super(...args);
    this.listenBalanceCells();
  }

  deleteColumn() {
    const [table, row, cell] = this.getTable();
    if (cell == null) return;
    const column = row.children.indexOf(cell);
    table.deleteColumn(column);
    this.quill.update(Quill.sources.USER);
    // TODO Restore selection
  }

  deleteRow() {
    const [, row] = this.getTable();
    if (row == null) return;
    row.remove();
    this.quill.update(Quill.sources.USER);
  }

  deleteTable() {
    const [table] = this.getTable();
    if (table == null) return;
    table.remove();
    this.quill.update(Quill.sources.USER);
  }

  getTable(range = this.quill.getSelection()) {
    if (range == null) return [null, null, null, -1];
    const [cell, offset] = this.quill.getLine(range.index);
    if (cell == null) return [null, null, null, -1];
    const row = cell.parent;
    const table = row.parent.parent;
    return [table, row, cell, offset];
  }

  insertColumn(offset) {
    const [table, row, cell] = this.getTable();
    if (cell == null) return;
    const column = row.children.offset(cell);
    table.insertColumn(column + offset);
    this.quill.update(Quill.sources.USER);
  }

  insertColumnLeft() {
    this.insertColumn(0);
  }

  insertColumnRight() {
    this.insertColumn(1);
  }

  insertRow(offset) {
    const [table, row, cell] = this.getTable();
    if (cell == null) return;
    const index = row.parent.children.indexOf(row);
    table.insertRow(index + offset);
    this.quill.update(Quill.sources.USER);
  }

  insertRowAbove() {
    this.insertRow(0);
  }

  insertRowBelow() {
    this.insertRow(1);
  }

  insertTable(rows, columns) {
    const range = this.quill.getSelection();
    if (range == null) return;
    const delta = new Array(rows).fill(0).reduce(memo => {
      const text = new Array(columns).fill('\n').join('');
      return memo.insert(text, { table: { row: tableId() } });
    }, new Delta());
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.index, Quill.sources.SILENT);
  }

  listenBalanceCells() {
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, mutations => {
      const tables = new Set(
        mutations
          .map(mutation => {
            if (mutation.target.tagName === 'TABLE') {
              return Quill.find(mutation.target);
            }
            return null;
          })
          .filter(blot => blot != null),
      );
      if (tables.length === 0) return;
      this.quill.once(Quill.events.TEXT_CHANGE, (delta, old, source) => {
        if (source !== Quill.sources.USER) return;
        tables.forEach(table => {
          table.balanceCells();
        });
      });
    });
  }
}

export default Table;
