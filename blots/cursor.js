import { EmbedBlot, Scope } from 'parchment';
import TextBlot from './text';

class Cursor extends EmbedBlot {
  static value() {
    return undefined;
  }

  constructor(scroll, domNode, selection) {
    super(scroll, domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this.savedLength = 0;
  }

  detach() {
    // super.detach() will also clear domNode.__blot
    if (this.parent != null) this.parent.removeChild(this);
  }

  format(name, value) {
    if (this.savedLength !== 0) {
      super.format(name, value);
      return;
    }
    let target = this;
    let index = 0;
    while (target != null && target.statics.scope !== Scope.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this.savedLength = Cursor.CONTENTS.length;
      target.optimize();
      target.formatAt(index, Cursor.CONTENTS.length, name, value);
      this.savedLength = 0;
    }
  }

  index(node, offset) {
    if (node === this.textNode) return 0;
    return super.index(node, offset);
  }

  length() {
    return this.savedLength;
  }

  position() {
    return [this.textNode, this.textNode.data.length];
  }

  remove() {
    super.remove();
    this.parent = null;
  }

  restore() {
    if (this.selection.composing || this.parent == null) return null;
    const range = this.selection.getNativeRange();
    let restoreText;
    let start;
    let end;
    if (
      range != null &&
      range.start.node === this.textNode &&
      range.end.node === this.textNode
    ) {
      [restoreText, start, end] = [
        this.textNode,
        range.start.offset,
        range.end.offset,
      ];
    }
    // Link format will insert text outside of anchor tag
    while (
      this.domNode.lastChild != null &&
      this.domNode.lastChild !== this.textNode
    ) {
      this.domNode.parentNode.insertBefore(
        this.domNode.lastChild,
        this.domNode,
      );
    }
    if (this.textNode.data !== Cursor.CONTENTS) {
      const text = this.textNode.data.split(Cursor.CONTENTS).join('');
      // Take text out of the cursor blot and add it to parchment and the DOM
      // before removing the cursor blot (which will be reused in the future).
      // Selection preservation note:  After we return the selection range we
      // want from this function, and before it is applied, TextBlots are
      // optimized, with any TextBlot that follows another TextBlot being
      // removed and its contents inserted into the previous one, and same with
      // the underlying text nodes.  Therefore, restoreText should not be a text
      // node that will be optimized away.  Another consideration here is that
      // we don't want the optimization in editor.update to run, because it
      // won't be able to figure out this change based on looking at the value
      // of the mutated text node. Therefore, we don't insert this.textNode into
      // the document, we keep it in the blot which is removed.
      if (this.prev instanceof TextBlot) {
        this.prev.insertAt(this.prev.length(), text);
        if (restoreText) {
          restoreText = this.prev.domNode;
          start += this.prev.length();
          end += this.prev.length();
        }
      } else {
        const newTextNode = document.createTextNode(text);
        this.parent.insertBefore(this.scroll.create(newTextNode), this);
        if (restoreText) {
          restoreText = newTextNode;
          start -= 1;
          end -= 1;
        }
      }
      this.textNode.data = Cursor.CONTENTS;
    }
    this.remove();
    if (restoreText) {
      [start, end] = [start, end].map(offset => {
        return Math.max(0, Math.min(restoreText.data.length, offset));
      });
      return {
        startNode: restoreText,
        startOffset: start,
        endNode: restoreText,
        endOffset: end,
      };
    }
    return null;
  }

  update(mutations, context) {
    if (
      mutations.some(mutation => {
        return (
          mutation.type === 'characterData' && mutation.target === this.textNode
        );
      })
    ) {
      const range = this.restore();
      if (range) context.range = range;
    }
  }

  value() {
    return '';
  }
}
Cursor.blotName = 'cursor';
Cursor.className = 'ql-cursor';
Cursor.tagName = 'span';
Cursor.CONTENTS = '\uFEFF'; // Zero width no break space

export default Cursor;
