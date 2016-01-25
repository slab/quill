import extend from 'extend';
import Block from '../blots/block';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class List extends Parchment.Container {
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
List.scope = Parchment.Scope.BLOCK_BLOT;
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
  format(name, value) {
    if (name === 'list' && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
  }

  formats() {
    let format = extend({}, super.formats(), {
      list: this.parent.domNode.tagName === 'OL' ? 'ordered' : 'bullet'
    });
    delete format[this.statics.blotName];
    return format;
  }

  replaceWith(name, value) {
    this.parent.isolate(this.offset(this.parent), this.length());
    let replacement = super.replaceWith(name, value);
    replacement.parent.unwrap();
    return replacement;
  }
}
ListItem.blotName = 'list-item';
ListItem.tagName = 'LI';


export { ListItem, List as default };

