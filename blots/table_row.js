import Parchment from 'parchment';
import Container from './container';
import TableCell from './table_cell';


class TableRow extends Container {

  static create(value) {
    let tagName = 'tr';
    let node = super.create(tagName);
    node.setAttribute('row_id', value);
    return node;
  }

  optimize() {
    super.optimize();
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        next.domNode.getAttribute('row_id') === this.domNode.getAttribute('row_id')) {
      next.moveChildren(this);
      next.remove();
    }
  }

}

TableRow.blotName = 'tr';
TableRow.tagName = 'tr';
TableRow.scope = Parchment.Scope.BLOCK_BLOT;
TableRow.defaultChild = 'td';
TableRow.allowedChildren = [TableCell];


export default TableRow
