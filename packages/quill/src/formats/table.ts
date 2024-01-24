import type { LinkedList } from 'parchment';
import Block from '../blots/block';
import Container from '../blots/container';

class TableCell extends Block {
  static blotName = 'table';
  static tagName = 'TD';

  static create(value: string) {
    const node = super.create() as HTMLElement;
    if (value) {
      node.setAttribute('data-row', value);
    } else {
      node.setAttribute('data-row', tableId());
    }
    return node;
  }

  static formats(domNode: HTMLElement) {
    if (domNode.hasAttribute('data-row')) {
      return domNode.getAttribute('data-row');
    }
    return undefined;
  }

  next: this | null;

  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }

  format(name: string, value: string) {
    if (name === TableCell.blotName && value) {
      this.domNode.setAttribute('data-row', value);
    } else {
      super.format(name, value);
    }
  }

  row(): TableRow {
    return this.parent as TableRow;
  }

  rowOffset() {
    if (this.row()) {
      return this.row().rowOffset();
    }
    return -1;
  }

  table() {
    return this.row() && this.row().table();
  }
}

class TableRow extends Container {
  static blotName = 'table-row';
  static tagName = 'TR';

  children: LinkedList<TableCell>;
  next: this | null;

  checkMerge() {
    // @ts-expect-error
    if (super.checkMerge() && this.next.children.head != null) {
      // @ts-expect-error
      const thisHead = this.children.head.formats();
      // @ts-expect-error
      const thisTail = this.children.tail.formats();
      // @ts-expect-error
      const nextHead = this.next.children.head.formats();
      // @ts-expect-error
      const nextTail = this.next.children.tail.formats();
      return (
        thisHead.table === thisTail.table &&
        thisHead.table === nextHead.table &&
        thisHead.table === nextTail.table
      );
    }
    return false;
  }

  optimize(context: { [key: string]: any }) {
    super.optimize(context);
    this.children.forEach((child) => {
      if (child.next == null) return;
      const childFormats = child.formats();
      const nextFormats = child.next.formats();
      if (childFormats.table !== nextFormats.table) {
        const next = this.splitAfter(child);
        if (next) {
          // @ts-expect-error TODO: parameters of optimize() should be a optional
          next.optimize();
        }
        // We might be able to merge with prev now
        if (this.prev) {
          // @ts-expect-error TODO: parameters of optimize() should be a optional
          this.prev.optimize();
        }
      }
    });
  }

  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }

  table() {
    return this.parent && this.parent.parent;
  }
}

class TableBody extends Container {
  static blotName = 'table-body';
  static tagName = 'TBODY';

  children: LinkedList<TableRow>;
}

class TableContainer extends Container {
  static blotName = 'table-container';
  static tagName = 'TABLE';

  children: LinkedList<TableBody>;

  balanceCells() {
    const rows = this.descendants(TableRow);
    const maxColumns = rows.reduce((max, row) => {
      return Math.max(row.children.length, max);
    }, 0);
    rows.forEach((row) => {
      new Array(maxColumns - row.children.length).fill(0).forEach(() => {
        let value;
        if (row.children.head != null) {
          value = TableCell.formats(row.children.head.domNode);
        }
        const blot = this.scroll.create(TableCell.blotName, value);
        row.appendChild(blot);
        // @ts-expect-error TODO: parameters of optimize() should be a optional
        blot.optimize(); // Add break blot
      });
    });
  }

  cells(column: number) {
    return this.rows().map((row) => row.children.at(column));
  }

  deleteColumn(index: number) {
    // @ts-expect-error
    const [body] = this.descendant(TableBody) as TableBody[];
    if (body == null || body.children.head == null) return;
    body.children.forEach((row) => {
      const cell = row.children.at(index);
      if (cell != null) {
        cell.remove();
      }
    });
  }

  insertColumn(index: number) {
    // @ts-expect-error
    const [body] = this.descendant(TableBody) as TableBody[];
    if (body == null || body.children.head == null) return;
    body.children.forEach((row) => {
      const ref = row.children.at(index);
      // @ts-expect-error
      const value = TableCell.formats(row.children.head.domNode);
      const cell = this.scroll.create(TableCell.blotName, value);
      row.insertBefore(cell, ref);
    });
  }

  insertRow(index: number) {
    // @ts-expect-error
    const [body] = this.descendant(TableBody) as TableBody[];
    if (body == null || body.children.head == null) return;
    const id = tableId();
    const row = this.scroll.create(TableRow.blotName) as TableRow;
    body.children.head.children.forEach(() => {
      const cell = this.scroll.create(TableCell.blotName, id);
      row.appendChild(cell);
    });
    const ref = body.children.at(index);
    body.insertBefore(row, ref);
  }

  rows() {
    const body = this.children.head;
    if (body == null) return [];
    return body.children.map((row) => row);
  }
}

TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;

TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;

TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;

function tableId() {
  const id = Math.random().toString(36).slice(2, 6);
  return `row-${id}`;
}

export { TableCell, TableRow, TableBody, TableContainer, tableId };
