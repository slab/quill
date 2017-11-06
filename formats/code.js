import Delta from 'quill-delta';
import Parchment from 'parchment';
import Block from '../blots/block';
import Inline from '../blots/inline';
import TextBlot from '../blots/text';

class Code extends Inline {}
Code.blotName = 'code';
Code.tagName = 'CODE';

class CodeBlock extends Block {
  static create(value) {
    const domNode = super.create(value);
    domNode.setAttribute('spellcheck', false);
    return domNode;
  }

  static formats() {
    return true;
  }

  delta() {
    let text = this.domNode.textContent;
    if (text.endsWith('\n')) {
      // Should always be true
      text = text.slice(0, -1);
    }
    return text.split('\n').reduce((delta, frag) => {
      return delta.insert(frag).insert('\n', this.formats());
    }, new Delta());
  }

  format(name, value) {
    if (name === this.statics.blotName && value) return;
    const [text] = this.descendant(TextBlot, this.length() - 1);
    if (text != null) {
      text.deleteAt(text.length() - 1, 1);
    }
    super.format(name, value);
  }

  formatAt(index, length, name, value) {
    if (length === 0) return;
    if (
      Parchment.query(name, Parchment.Scope.BLOCK) == null ||
      (name === this.statics.blotName &&
        value === this.statics.formats(this.domNode))
    ) {
      return;
    }
    const nextNewline = this.newlineIndex(index);
    if (nextNewline < 0 || nextNewline >= index + length) return;
    const prevNewline = this.newlineIndex(index, true) + 1;
    const isolateLength = nextNewline - prevNewline + 1;
    const blot = this.isolate(prevNewline, isolateLength);
    const { next } = blot;
    blot.format(name, value);
    if (next instanceof CodeBlock) {
      next.formatAt(
        0,
        index - prevNewline + length - isolateLength,
        name,
        value,
      );
    }
  }

  insertAt(index, value, def) {
    if (def != null) return;
    const [text, offset] = this.descendant(TextBlot, index);
    text.insertAt(offset, value);
  }

  length() {
    const { length } = this.domNode.textContent;
    if (!this.domNode.textContent.endsWith('\n')) {
      return length + 1;
    }
    return length;
  }

  newlineIndex(searchIndex, reverse = false) {
    if (!reverse) {
      const offset = this.domNode.textContent.slice(searchIndex).indexOf('\n');
      return offset > -1 ? searchIndex + offset : -1;
    }
    return this.domNode.textContent.slice(0, searchIndex).lastIndexOf('\n');
  }

  optimize(context) {
    if (!this.domNode.textContent.endsWith('\n')) {
      this.appendChild(Parchment.create('text', '\n'));
    }
    super.optimize(context);
    const { next } = this;
    if (
      next != null &&
      next.prev === this &&
      next.statics.blotName === this.statics.blotName &&
      this.statics.formats(this.domNode) === next.statics.formats(next.domNode)
    ) {
      next.optimize(context);
      next.moveChildren(this);
      next.remove();
    }
  }

  replace(target) {
    super.replace(target);
    [].slice.call(this.domNode.querySelectorAll('*')).forEach(node => {
      const blot = Parchment.find(node);
      if (blot == null) {
        node.parentNode.removeChild(node);
      } else if (blot instanceof Parchment.Embed) {
        blot.remove();
      } else {
        blot.unwrap();
      }
    });
  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.tagName = 'PRE';
CodeBlock.TAB = '  ';

export { Code, CodeBlock as default };
