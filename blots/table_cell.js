import Parchment from 'parchment';
import Container from './container';
import ContainBlot from './contain';
import Block, { BlockEmbed } from './block';


class TableCell extends ContainBlot {

  static randomId() {
    return Math.random().toString(36).slice(2)
  }

  static create(value) {
    // console.log(value) // eslint-disable-line
    if(value == true) {
      value = this.randomId() + '|' +
              this.randomId() + '|' +
              this.randomId();
    }
    let tagName = 'td';
    let node = super.create(tagName);
    let ids = value.split('|')
    node.setAttribute('table_id', ids[0]);
    node.setAttribute('row_id', ids[1]);
    node.setAttribute('cell_id', ids[2]);
    node.setAttribute('style', ids[3] ? ids[3] : null);
    return node;
  }

  format(name, value) {
    // console.log('name: ' + name + ' value: ' + value);
    if (name != null) {
      if(value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    }
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]:
      this.domNode.getAttribute('table_id') + '|' +
      this.domNode.getAttribute('row_id') + '|' +
      this.domNode.getAttribute('cell_id') + '|' +
      this.domNode.getAttribute('style')
    }
  }

  optimize() {
    super.optimize();

    // Add parent TR and TABLE when missing
    let parent = this.parent;
    if (parent != null && parent.statics.blotName != 'tr') {
      // we will mark td position, put in table and replace mark
      let mark = Parchment.create('block');
      this.parent.insertBefore(mark, this.next);
      let table = Parchment.create('table', this.domNode.getAttribute('table_id'));
      let tr = Parchment.create('tr', this.domNode.getAttribute('row_id'));
      table.appendChild(tr);
      tr.appendChild(this);
      table.replace(mark)
    }

    // merge same TD id
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        next.domNode.getAttribute('cell_id') === this.domNode.getAttribute('cell_id')) {
      next.moveChildren(this);
      next.remove();
    }
  }

}

TableCell.blotName = 'td';
TableCell.tagName = 'td';
TableCell.scope = Parchment.Scope.BLOCK_BLOT;
TableCell.defaultChild = 'block';
TableCell.allowedChildren = [Block, BlockEmbed, Container];


export default TableCell
