import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Cursor extends Parchment.Leaf {
  constructor(value) {
    super(value);
    this.domNode.classList.add(Parchment.PREFIX + 'cursor');
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
  }

  getLength() {
    return this.textNode.data.length;
  }

  getValue() {
    return this.textNode.data.replace(Cursor.CONTENTS, '');
  }
}
Cursor.blotName = 'cursor';
Cursor.tagName = 'span';
Cursor.CONTENTS = "\uFEFF";   // Zero width space


Parchment.register(Cursor, false);

export { Cursor as default };
