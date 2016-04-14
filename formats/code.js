import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import Block from '../blots/block';
import Inline from '../blots/inline';


class Code extends Inline {}
Code.blotName = 'code';
Code.tagName = 'CODE';


class CodeBlock extends Block {
  static formats(domNode) {
    return true;
  }

  delta() {
    let text = this.descendants(Parchment.Leaf).map(function(leaf) {
      return leaf instanceof Parchment.Text ? leaf.value() : '';
    }).join('');
    return new Delta().insert(text).insert('\n', this.formats());
  }

  formatAt(index, length, name, value) {
    if (Parchment.query(name, Parchment.Scope.BLOCK) || name === this.statics.blotName) {
      super.formatAt(index, length, name, value);
    }
  }

  replace(target) {
    super.replace(target);
    this.descendants(function(blot) {
      return !(blot instanceof Parchment.Text);
    }).forEach(function(blot) {
      if (blot instanceof Parchment.Embed) {
        blot.remove();
      } else {
        blot.unwrap();
      }
    });
  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.tagName = 'PRE';


export { Code, CodeBlock as default };
