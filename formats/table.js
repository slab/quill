import Block from '../blots/block';
import Container from '../blots/container';

class TableCell extends Block {
  static create(value) {
    const node = super.create();
    if (value && value.row) {
      node.setAttribute('data-row', value.row);
    } else {
      node.setAttribute(
        'data-row',
        Math.random()
          .toString(36)
          .slice(4),
      );
    }
    node.setAttribute('contenteditable', true);
    return node;
  }

  static formats(domNode) {
    if (domNode.hasAttribute('data-row')) {
      return {
        row: domNode.getAttribute('data-row'),
      };
    }
    return undefined;
  }
}
TableCell.blotName = 'table';
TableCell.tagName = 'TD';

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

class TableContainer extends Container {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('contenteditable', false);
    return node;
  }
}
TableContainer.blotName = 'table-container';
TableContainer.tagName = 'TABLE';

TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;

TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;

TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;

export { TableContainer, TableBody, TableRow, TableCell };
