import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Block from '../blots/block';
import Inline from '../blots/inline';


class Code extends Inline {
  formats() {
    return this.parent instanceof CodeBlock ? {} : super.formats();
  }
}
Code.blotName = 'code';
Code.tagName = 'CODE';


class CodeBlock extends Block {
  delta() {
    return this.domNode.innerText.split('\n').reduce((delta, text) => {
      return delta.insert(text).insert('\n', this.formats());
    }, new Delta());
  }

  format(name, value) {
    if (name !== this.statics.blotName) return;
    super.formatAt(name, value);
  }

  formatAt(index, length, name, value) {
    if (name !== this.statics.blotName) return;
    super.formatAt(index, length, name, value);
  }

  insertAt(index, value, def) {
    if (def != null) return;  // Cannot insert embeds into code
    let [child, offset] = this.children.find(index);
    child.insertAt(offset, value);
  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.childless = 'code';
CodeBlock.tagName = 'PRE';


export { Code, CodeBlock as default };
