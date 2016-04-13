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

  static formats(domNode) {
    if (domNode.tagName === 'OL') return 'ordered';
    if (domNode.tagName === 'UL') return 'bullet';
    return undefined;
  }

  formats() {
    // We don't inherit from FormatBlot
    let formats = {};
    formats[this.statics.blotName] = this.statics.formats(this.domNode);
    return formats;
  }

  optimize() {
    super.optimize();
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName) {
      next.moveChildren(this);
      next.remove();
    }
  }

  replace(target) {
    super.replace(target);
    if (target.statics.blotName !== this.statics.blotName) {
      let item = Parchment.create(this.statics.childless);
      this.moveChildren(item);
      this.appendChild(item);
    }
  }
}
List.blotName = 'list';
List.childless = 'list-item';
List.scope = Parchment.Scope.BLOCK_BLOT;
List.tagName = ['OL', 'UL'];


class ListItem extends Block {
  static formats(domNode) {
    return domNode.tagName === ListItem.tagName ? undefined : super.formats(domNode);
  }

  format(name, value) {
    if (name === List.blotName && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
  }

  replaceWith(name, value) {
    this.parent.isolate(this.offset(this.parent), this.length());
    if (name === List.blotName) {
      this.parent.replaceWith(name, value);
      return this;
    } else {
      let replacement = super.replaceWith(name, value);
      replacement.parent.unwrap();
      return replacement;
    }
  }
}
ListItem.blotName = 'list-item';
ListItem.tagName = 'LI';


export { ListItem, List as default };
