import {BlockEmbed} from '../blots/block';


class Table extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    value.forEach(row => {
      var tr = document.createElement('TR');
      node.appendChild(tr);
      row.forEach(cell => {
        let td = document.createElement('TD');
        td.textContent = cell;
        tr.appendChild(td);
      })
    })
    return node;
  }

  static value(node) {
    var ret = [];
    if(node.tagName === 'TABLE') {
      let rows = node.rows;
      // TODO: this is ugly and brittle, needs more
      // tests for different table shapes
      for (let i = 0; i < rows.length; i++) {
        ret[i] = [];
        for (let j = 0; j < rows[i].cells.length; j++) {
          ret[i].push(rows[i].cells[j].textContent);
        }
      }
    }
    return ret;
  }
}

Table.blotName = 'table';
Table.tagName = 'TABLE';

export {Table as default};
