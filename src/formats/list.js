import Block from '../blots/block';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Bullet extends Parchment.Container {
  insertBefore(child, refBlot) {
    if (child instanceof Item) {
      super.insertBefore(child, refBlot);
    } else {
      if (this.children.length === 0) {
        this.appendChild(Parchment.create('item'));
      }
      this.children.head.appendChild(child);
      if (child instanceof Parchment.Block) {
        child.unwrap();
      }
    }
  }

  merge(target = this.next) {
    if (target != null && this.statics.blotName === target.statics.blotName) {
      // OL/UL should not have DOM attributes
      target.moveChildren(this);
      target.remove();
    }
    return false;
  }
}
Bullet.blotName = 'bullet';
Bullet.tagName = 'UL';


class List extends Bullet { }
List.blotName = 'list';
List.tagName = 'OL';


class Item extends Block {
  format(name, value) {
    if (Parchment.match(name, Parchment.Type.ATTRIBUTE)) {
      super.format(name, value);
    } else {
      let target = this.parent.isolate(this.offset(), this.getLength());
      if (value) {
        target.replace(name, value);
      } else {
        target.replace('block');
      }
      if (!(this.parent instanceof Bullet)) {
        this.unwrap();
      }
    }
  }

  getFormat() {
    let formats = super.getFormat();
    delete formats['item'];
    formats[this.parent.statics.blotName] = true;
    return formats;
  }
}
Item.blotName = 'item';
Item.tagName = 'LI';


Parchment.register(Bullet);
Parchment.register(List);
Parchment.register(Item);

export { Bullet, Item, List };
