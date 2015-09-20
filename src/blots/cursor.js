import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Cursor extends Parchment.Embed {
  constructor(value) {
    super(value);
    this.domNode.classList.add(Parchment.PREFIX + 'cursor');
    this.domNode.appendChild(document.createTextNode("\uFEFF"));    // Zero width space
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


Parchment.register(Cursor);
Parchment.register(Parchment.Inline);   // Redefine to overwrite cursor

export { Cursor as default };
