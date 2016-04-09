import extend from 'extend';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import BreakBlot from 'quill/blots/break';


const NEWLINE_LENGTH = 1;


class BlockEmbed extends Parchment.Embed {
  attach() {
    super.attach();
    this.attributes = new Parchment.Attributor.Store(this.domNode);
  }

  delta() {
    return new Delta().insert(this.value()).insert('\n', this.attributes.values());
  }

  length() {
    return super.length() + NEWLINE_LENGTH;
  }
}
BlockEmbed.scope = Parchment.Scope.BLOCK_BLOT;
// It is important for cursor behavior BlockEmbeds use tags that are block level elements


class BlockContainer extends Parchment.Container {
  formats() {
    let formats = {};
    formats[this.statics.blotName] = this.statics.formats(this.domNode);
    return formats;
  }

  optimize(mutations) {
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
    let item = Parchment.create(this.statics.childless);
    this.moveChildren(item);
    this.appendChild(item);
  }
}


class Block extends Parchment.Block {
  constructor(domNode) {
    super(domNode);
    this.optimize();
  }

  delta() {
    return this.descendants(Parchment.Leaf).reduce((delta, leaf) => {
      if (leaf.length() === 0) {
        return delta;
      } else {
        return delta.insert(leaf.value(), bubbleFormats(leaf));
      }
    }, new Delta()).insert('\n', bubbleFormats(this));
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
    return super.path(index, true);
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
Block.childless = 'break';
Block.tagName = 'P';


function bubbleFormats(blot, formats = {}) {
  if (blot == null) return formats;
  if (typeof blot.formats === 'function') {
    formats = extend(formats, blot.formats());
  }
  if (blot.parent == null || blot.parent.blotName == 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
    return formats;
  }
  return bubbleFormats(blot.parent, formats);
}


export { bubbleFormats, BlockEmbed, BlockContainer, Block as default };
