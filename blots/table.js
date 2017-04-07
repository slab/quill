import Parchment from 'parchment';
import Container from './container';
import TableRow from './table_row';


class Table extends Container {

  static create(value) {
    let tagName = 'table';
    let node = super.create(tagName);
    node.setAttribute('table_id', value);
    return node;
  }

  optimize() {
    super.optimize();
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        next.domNode.getAttribute('table_id') === this.domNode.getAttribute('table_id')) {
      next.moveChildren(this);
      next.remove();
    }
  }

}

Table.blotName = 'table';
Table.tagName = 'table';
Table.scope = Parchment.Scope.BLOCK_BLOT;
Table.defaultChild = 'tr';
Table.allowedChildren = [TableRow];


export default Table;
