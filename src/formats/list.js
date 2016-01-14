// Format list into something else

// Format paragraph into list


import extend from 'extend';
import Block from '../blots/block';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class List extends Parchment.Block {
  format(name, value) {
    if (this.children.tail != null) {
      this.children.tail.format(name, value);
    }
  }

  getFormat() {
    let format = this.domNode.tagName === 'OL' ? 'ordered' : 'bullet'
    return extend({}, super.getFormat(), { list: format });
  }

  optimize(mutations) {
    super.optimize();
    let next = this.next;
    if (next instanceof List && next.prev === this && next.domNode.tagName === this.domNode.tagName) {
      next.moveChildren(this);
      next.remove();
    }
  }

  replace(victim) {
    super.replace(victim);
    let item = Parchment.create('list-item');
    this.moveChildren(item);
    this.appendChild(item);
  }
}
List.blotName = 'list';
List.tagName = ['OL', 'UL'];
List.create = function(value) {
  if (value === 'ordered') {
    value = 'OL';
  } else if (value === 'bullet') {
    value = 'UL';
  }
  return Parchment.Block.create.call(List, value);
}


class ListItem extends Block {
  getFormat() {
    let format = extend({}, super.getFormat(), this.parent.getFormat());
    delete format['list-item'];
    return format;
  }

  replaceWith(name, value) {
    this.parent.isolate(this.offset(this.parent), this.getLength());
    let replacement = super.replaceWith(name, value);
    replacement.parent.unwrap();
    return replacement;
  }
}
ListItem.blotName = 'list-item';
ListItem.tagName = 'LI';


Parchment.register(List);
Parchment.register(ListItem);

export { List as default };

