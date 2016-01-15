import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Cursor extends Parchment.Leaf {
  constructor(domNode) {
    super(domNode);
    this.domNode.classList.add(Parchment.PREFIX + 'cursor');
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
  }

  getLength() {
    return 0;
  }

  getValue() {
    return '';
  }
}
Cursor.blotName = 'cursor';
Cursor.tagName = 'span';
Cursor.CONTENTS = "\uFEFF";   // Zero width space


Parchment.register(Cursor);
Parchment.register(Parchment.Inline);   // Workaround from Cursor matching span

export { Cursor as default };
