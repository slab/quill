import extend from 'extend';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Block from 'quill/blots/block';


class List extends Parchment.Container {
  static create(value) {
    if (value === 'ordered') {
      value = 'OL';
    } else if (value === 'bullet') {
      value = 'UL';
    }
    return super.create(value);
  }

  optimize(mutations) {
    super.optimize();
    let next = this.next;
    if (next instanceof List && next.prev === this && next.domNode.tagName === this.domNode.tagName) {
      next.moveChildren(this);
      next.remove();
    }
  }

  replace(target) {
    super.replace(target);
    let item = Parchment.create('list-item');
    this.moveChildren(item);
    this.appendChild(item);
  }
}
List.blotName = 'list';
List.scope = Parchment.Scope.BLOCK_BLOT;
List.tagName = ['OL', 'UL'];


class ListItem extends Block {
  static formats(domNode) {
    let format = {};
    if (domNode.parentNode != null) {
      format['list'] = domNode.parentNode.tagName === 'OL' ? 'ordered' : 'bullet';
    }
    return format;
  }

  format(name, value) {
    if (name === 'list' && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
  }

  formats() {
    let format = super.formats();
    delete format[this.statics.blotName];
    return extend(this.statics.formats(this.domNode), format);
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
