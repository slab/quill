import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import extend from 'extend';


const NEWLINE_LENGTH = 1;


class Block extends Parchment.Block {
  build() {
    super.build();
    this.ensureChild();
  }

  deleteAt(index, length) {
    super.deleteAt(index, length);
    this.ensureChild();
  }

  ensureChild() {
    if (this.children.length === 0) {
      return this.appendChild(Parchment.create('break'));
    }
  }

  findPath(index) {
    return super.findPath(index, true);
  }

  format(name, value) {
    let blot = Parchment.match(name, Parchment.Type.BLOT);
    if (blot != null) {
      if (blot.prototype instanceof Parchment.Block ||
          blot.prototype instanceof Parchment.Container) {
        super.format(name, value);
      }
    } else if (Parchment.match(name, Parchment.Type.ATTRIBUTE)) {
      super.format(name, value);
    }
  }

  formatAt(index, length, name, value) {
    if (length <= 0) return;
    if (index + length >= this.getLength()) {
      this.format(name, value);
    }
    super.formatAt(index, Math.min(length, this.getLength() - index - 1), name, value);
  }

  getDelta() {
    let leaves = this.getDescendants(Parchment.Leaf);
    return leaves.reduceRight((delta, blot) => {
      if (blot.getLength() === 0) return delta;
      let attributes = {};
      let value = blot.getValue();
      while (blot !== this) {
        attributes = extend({}, blot.getFormat(), attributes);
        blot = blot.parent;
      }
      return new Delta().insert(value, attributes).concat(delta);
    }, new Delta().insert('\n', this.getFormat()));
  }

  getLength() {
    return super.getLength() + NEWLINE_LENGTH;
  }

  getValue() {
    return super.getValue().concat('\n');
  }

  insertAt(index, value, def) {
    if (def != null) return super.insertAt(index, value, def);
    if (value.length === 0) return;
    let lines = value.split('\n');
    let text = lines.shift();
    if (index < this.getLength() - 1) {
      super.insertAt(index, text);
    } else {
      this.children.tail.insertAt(this.children.tail.getLength(), text);
    }
    if (lines.length > 0) {
      let next = this.split(index + text.length, true);
      next.insertAt(0, lines.join('\n'));
    }
  }

  insertBefore(blot, ref) {
    let br;
    if (this.children.head != null && this.children.head.statics.blotName === 'break') {
      br = this.children.head;
    }
    super.insertBefore(blot, ref);
    if (br != null) {
      br.remove();
    }
  }

  split(index, force = false) {
    if (force && (index === 0 || index >= this.getLength() - NEWLINE_LENGTH)) {
      let after = this.clone();
      if (index === 0) {
        this.moveChildren(after);
        this.ensureChild();
      } else {
        after.ensureChild();
      }
      this.parent.insertBefore(after, this.next);
      return after;
    } else {
      return super.split(index, force);
    }
  }
}
Block.blotName = 'block';
Block.tagName = 'P';


Parchment.register(Block);

export { Block as default };
