import Parchment from 'parchment';
import Embed from './embed';


class Cursor extends Embed {
  constructor(domNode, selection) {
    super(domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this._length = 0;
  }

  detach() {
    if (this.parent == null) return;
    let text = this.textNode.data;
    let restore = function() {};
    let range = this.selection.getNativeRange();
    if (range != null && range.start.node === this.textNode && range.end.node === this.textNode) {
      restore = this.selection.setNativeRange.bind(this.selection, this.textNode, Math.max(0, range.start.offset - 1), this.textNode, Math.max(0, range.end.offset - 1));
    }
    if (text !== Cursor.CONTENTS) {
      let native = this.selection.getNativeRange();
      this.textNode.data = text.split(Cursor.CONTENTS).join('');
      this.parent.insertBefore(Parchment.create(this.textNode), this);
      this.textNode = document.createTextNode(Cursor.CONTENTS);
      this.domNode.appendChild(this.textNode);
    }
    this.remove();
    this.parent = null;
    restore();
  }

  format(name, value) {
    if (this._length !== 0) {
      return super.format(name, value);
    }
    let target = this, index = 0;
    this._length = Cursor.CONTENTS.length;
    while (target != null && !(target instanceof Parchment.Block)) {
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

  update(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' && mutation.target === this.textNode) {
        this.detach();
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
Cursor.CONTENTS = "\uFEFF";   // Zero width space


export default Cursor;
