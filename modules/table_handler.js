import Module from '../core/module';
import Parchment from 'parchment';
import Quill from '../core/quill';

import Table from '../blots/table';
import TableRow from '../blots/table_row';
import TableCell from '../blots/table_cell';
import ContainBlot from '../blots/contain';


Quill.register({
  'blots/table'        : Table,
  'blots/table_row'    : TableRow,
  'blots/table_cell'   : TableCell,
  'blots/contain'      : ContainBlot
})


class TableHandler extends Module {

  randomId() {
    return Math.random().toString(36).slice(2)
  }

  findTd(what) {
    let leaf = this.quill.getLeaf(this.quill.getSelection()['index']);
    let blot = leaf[0];
    for(;blot != null && blot.statics.blotName != what;) {
      blot = blot.parent;
    }
    return blot; // return TD or NULL
  }

  appendCol() {
    let td = this.findTd('td');
    let _this = this;
    if(td) {
      let table = td.parent.parent;
      let tableId = table.domNode.getAttribute('table_id')
      td.parent.parent.children.forEach(function(tr) {
        let rowId = tr.domNode.getAttribute('row_id');
        let cellId = _this.randomId();
        let td = Parchment.create('td', tableId + '|' + rowId + '|' + cellId);
        tr.appendChild(td);
      });
    }
  }

  appendRow() {
    let td = this.findTd('td');
    if(td) {
      let colCount = td.parent.children.length;
      let table = td.parent.parent;
      let newRow = td.parent.clone();
      let tableId = table.domNode.getAttribute('table_id');
      let rowId = this.randomId();
      newRow.domNode.setAttribute('row_id', rowId);
      for (var i = colCount - 1; i >= 0; i--) {
        let cellId = this.randomId();
        let td = Parchment.create('td', tableId + '|' + rowId + '|' + cellId);
        newRow.appendChild(td);
      }
      table.appendChild(newRow);
    }
  }

  removeRow() {
    let td = this.findTd('td');
    if(td) {
      let tr = td.parent;
      tr.remove();
    }
  }

  removeCol() {
    let td = this.findTd('td');
    if(td) {
      let table = td.parent.parent;
      let cellId = td.domNode.getAttribute('cell_id');
      let colIndex = 1;

      // Count colIndex
      td.parent.children.forEach(function loop(_td) {
        if(_td.domNode.getAttribute('cell_id') == cellId) {
          loop.stop = true;
          return;
        }
        // ~~ hack: Ecmascript doesn't support `break` :-/ ~~
        if(!loop.stop) {
          colIndex += 1;
        }
      })

      // Remove all TDs with the colIndex
      table.children.forEach(function(tr) {
        let _td = tr.children.find(colIndex)[0];
        if(_td) {
          _td.remove();
        }
      });
    }
  }

  removeTable() {
    let td = this.findTd('td');
    if(td) {
      let table = td.parent.parent;
      table.remove();
    }
  }

  cellBackground(color) {
    let td = this.findTd('td');
    if(td) {
      let style = 'background:' + color;
      td.format('style', color ? style : false);
    }
  }

}


export default TableHandler
