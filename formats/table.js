import Block from '../blots/block';
import Container from '../blots/container';
import Quill from '../core/quill';

class TableContainer extends Container {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('contenteditable', false);
    return node;
  }
}
TableContainer.blotName = 'table-container';
TableContainer.tagName = 'TABLE';

class TableBody extends Container {}
TableBody.blotName = 'table-body';
TableBody.tagName = 'TBODY';

class TableRow extends Container {
  checkMerge() {
    if (super.checkMerge()) {
      const thisCell = this.children.tail.formats();
      const nextCell = this.next.children.head.formats();
      return thisCell.table.row === nextCell.table.row;
    }
    return false;
  }
}
TableRow.blotName = 'table-row';
TableRow.tagName = 'TR';

class TableCell extends Block {
  static create(value) {
    const node = super.create();
    if (value && value.row) {
      node.setAttribute('data-row', value.row);
    } else {
      node.setAttribute('data-row', tableId());
    }
    node.setAttribute('contenteditable', true);
    return node;
  }

  balanceCells() {
    const rows = this.descendants(TableRow);
    const maxColumns = rows.reduce((max, row) => {
      return Math.max(row.children.length, max);
    }, 0);
    rows.forEach(row => {
      new Array(maxColumns - row.children.length).fill(0).forEach(() => {
        let value;
        if (row.children.head != null) {
          value = TableCell.formats(row.children.head.domNode);
        }
        const blot = Parchment.create(TableCell.blotName, value);
        row.appendChild(blot);
        blot.optimize(); // Add break blot
      });
    });
  static formats(domNode) {
    if (domNode.hasAttribute('data-row')) {
      return {
        row: domNode.getAttribute('data-row'),
      };
    }
    return undefined;
  }

  static register() {
    Quill.register(TableRow);
    Quill.register(TableBody);
    Quill.register(TableContainer);
  }

  table() {
    let cur = this.parent;
    while (cur != null && cur.statics.blotName !== 'table-container') {
      cur = cur.parent;
    }
    return cur;
  }
}
TableCell.blotName = 'table';
TableCell.tagName = 'TD';

TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;

TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;

TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;

function tableId() {
  return Math.random()
    .toString(36)
    .slice(4);
}

export { TableCell as default, tableId };
