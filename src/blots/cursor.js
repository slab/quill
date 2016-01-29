import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Embed from './embed';


class Cursor extends Embed {
  constructor(domNode) {
    super(domNode);
    this.domNode.classList.add(Parchment.PREFIX + 'cursor');
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this._length = 0;
  }

  detach() {
    if (this.parent == null) return;
    let text = this.textNode.data;
    if (text.length !== Cursor.CONTENTS) {
      this.textNode.data = text.split(Cursor.CONTENTS).join('');
      this.parent.insertBefore(Parchment.create(this.textNode), this);
      this.textNode = document.createTextNode(Cursor.CONTENTS);
      this.domNode.appendChild(this.textNode);
    }
    this.remove();
    this.parent = null;
  }

  format(name, value) {
    if (this._length !== 0) {
      return super.format(name, value);
    }
    let target = this, index = 0;
    this._length = 1;
    while (target != null && !(target instanceof Parchment.Block)) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      target.formatAt(index, 1, name, value);
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
Cursor.tagName = 'span';
Cursor.CONTENTS = "\uFEFF";   // Zero width space


export default Cursor;
