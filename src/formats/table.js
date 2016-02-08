import extend from 'extend';
import Parchment from 'parchment';
import Block from '../blots/block';
import Inline from '../blots/inline';


class Table extends Parchment.Container {}
Table.blotName = 'table';
Table.child = 'table-section';
Table.scope = Parchment.Scope.BLOCK_BLOT;
Table.tagName = 'TABLE';

class TableSection extends Parchment.Container {}
TableSection.blotName = 'table-section';
TableSection.child = 'table-row';
TableSection.scope = Parchment.Scope.BLOCK_BLOT;
TableSection.tagName = ['THEAD', 'TBODY', 'TFOOT'];


class TableRow extends Block {
  formats() {
    let format = super.formats();
    switch (this.domNode.parentNode.tagName) {
      case 'THEAD': format['table-row'] = 'header'; break;
      case 'TFOOT': format['table-row'] = 'footer'; break;
      default:      format['table-row'] = 'body'; break;
    }
    return format;
  }

  insertBefore(blot, refBlot) {
    if (blot instanceof TableCell) {
      super.insertBefore(blot, refBlot);
    } else {
      blot.remove();
    }
  }
}
TableRow.blotName = 'table-row';
TableRow.child = 'table-cell'
TableRow.tagName = 'TR';


class TableCell extends Parchment.Container {
  formats() {
    return {
      'table-cell': [].indexOf.call(this.parent.domNode.childNodes, this.domNode)
    };
  }
}
TableCell.blotName = 'table-cell';
TableCell.child = 'break';
TableCell.scope = Parchment.Scope.INLINE_BLOT;
TableCell.tagName = 'TD';


export { TableSection, TableRow, TableCell, Table as default };
