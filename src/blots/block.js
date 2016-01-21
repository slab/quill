import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import BreakBlot from './break';


const NEWLINE_LENGTH = 1;


class Block extends Parchment.Block {
  constructor(domNode) {
    super(domNode);
    this.optimize();
  }

  findNode(index) {
    if (index === this.length()) {
      return [this.children.tail.domNode, this.children.tail.length()];
    }
    return super.findNode(index);
  }

  formatAt(index, length, name, value) {
    if (length <= 0) return;
    if (Parchment.query(name, Parchment.Scope.BLOCK)) {
      if (index + length === this.length()) {
        this.format(name, value);
      }
    } else {
      super.formatAt(index, Math.min(length, this.length() - index - 1), name, value);
    }
  }

  insertAt(index, value, def) {
    if (def != null) return super.insertAt(index, value, def);
    if (value.length === 0) return;
    let lines = value.split('\n');
    let text = lines.shift();
    if (text.length > 0) {
      if (index < this.length() - 1) {
        super.insertAt(index, text);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text);
      }
    }
    if (lines.length > 0) {
      let next = this.split(index + text.length, true);
      next.insertAt(0, lines.join('\n'));
    }
  }

  insertBefore(blot, ref) {
    if (this.children.head instanceof BreakBlot) {
      if (ref === this.children.head) ref = null;
      this.children.head.remove();
    }
    super.insertBefore(blot, ref);
  }

  length() {
    return super.length() + NEWLINE_LENGTH;
  }

  path(index) {
    if (index < this.length() - 1) return super.path(index);
    let blot = this, position = [];
    do {
      if (blot instanceof Parchment.Container) {
        let offset = blot.children.offset(blot.children.tail);
        position.push([blot, offset]);
        blot = blot.children.tail;
      } else {
        position.push([blot, blot.length()]);
        break;
      }
    } while (blot != null);
    return position;
  }

  split(index, force = false) {
    if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
      let clone = this.clone();
      if (index === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      } else {
        this.parent.insertBefore(clone, this.next);
        return clone;
      }
    } else {
      return super.split(index, force);
    }
  }
}
Block.blotName = 'block';
Block.child = 'break';
Block.tagName = 'P';


export default Block;
