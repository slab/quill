import Parchment from 'parchment';
import Embed from './embed';


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
    this.composing = false;
    this.selection.root.addEventListener('compositionstart', () => {
      this.composing = true;
    });
    this.selection.root.addEventListener('compositionend', () => {
      this.composing = false;
    });
  }

  detach() {
    // super.detach() will also clear domNode.__blot
    if (this.parent != null) this.parent.children.remove(this);
  }

  format(name, value) {
    if (this._length !== 0) {
      return super.format(name, value);
    }
    let target = this, index = 0;
    this._length = Cursor.CONTENTS.length;
    while (target != null && target.statics.scope !== Parchment.Scope.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      target.formatAt(index, Cursor.CONTENTS.length, name, value);
    }
    this._length = 0;
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
    if (this.composing) return;
    if (this.parent == null) return;
    let textNode = this.textNode;
    let range = this.selection.getNativeRange();
    // Link format will insert text outside of anchor tag
    while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    }
    if (this.textNode.data !== Cursor.CONTENTS) {
      let native = this.selection.getNativeRange();
      this.textNode.data = this.textNode.data.split(Cursor.CONTENTS).join('');
      this.parent.insertBefore(Parchment.create(this.textNode), this);
      this.textNode = document.createTextNode(Cursor.CONTENTS);
      this.domNode.appendChild(this.textNode);
    }
    this.remove();
    if (range != null && range.start.node === textNode && range.end.node === textNode) {
      this.selection.setNativeRange(textNode, Math.max(0, range.start.offset - 1), textNode, Math.max(0, range.end.offset - 1));
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
