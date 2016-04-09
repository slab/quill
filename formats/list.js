import extend from 'extend';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Block, { BlockContainer } from 'quill/blots/block';


class List extends BlockContainer {
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
    if (name === 'list' && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
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
