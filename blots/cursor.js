import Parchment from 'parchment';
import Embed from './embed';
import Emitter from '../core/emitter';


class Cursor extends Embed {
  static value(domNode) {
    return undefined;
  }

  constructor(domNode, selection) {
    super(domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this._length = 0;
  }

  detach() {
    // super.detach() will also clear domNode.__blot
    if (this.parent != null) this.parent.removeChild(this);
  }

  format(name, value) {
    if (this._length !== 0) {
      return super.format(name, value);
    }
    let target = this, index = 0;
    while (target != null && target.statics.scope !== Parchment.Scope.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this._length = Cursor.CONTENTS.length;
      target.optimize();
      target.formatAt(index, Cursor.CONTENTS.length, name, value);
      this._length = 0;
    }
  }

  index(node, offset) {
    if (node === this.textNode) return 0;
    return super.index(node, offset);
  }

  length() {
    return this._length;
  }

  position(index) {
    return [this.textNode, this.textNode.data.length];
  }

  remove() {
    super.remove();
    this.parent = null;
  }

  restore() {
    if (this.selection.composing) return;
    if (this.parent == null) return;
    let textNode = this.textNode;
    let range = this.selection.getNativeRange();
    // Link format will insert text outside of anchor tag
    while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    }
    if (this.textNode.data !== Cursor.CONTENTS) {
      this.textNode.data = this.textNode.data.split(Cursor.CONTENTS).join('');
      this.parent.insertBefore(Parchment.create(this.textNode), this);
      this.textNode = document.createTextNode(Cursor.CONTENTS);
      this.domNode.appendChild(this.textNode);
    }
    this.remove();
    if (range != null && range.start.node === textNode && range.end.node === textNode) {
      this.selection.emitter.once(Emitter.events.SCROLL_OPTIMIZE, () => {
        let [start, end] = [range.start.offset, range.end.offset].map(function(offset) {
          return Math.max(0, Math.min(textNode.data.length, offset - 1));
        });
        this.selection.setNativeRange(textNode, start, textNode, end);
      });
    }
  }

  update(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' && mutation.target === this.textNode) {
        this.restore();
      }
    });
  }

  value() {
    return '';
  }
}
Cursor.blotName = 'cursor';
Cursor.className = 'ql-cursor';
Cursor.tagName = 'span';
Cursor.CONTENTS = "\uFEFF";   // Zero width no break space


export default Cursor;
