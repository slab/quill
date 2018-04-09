import Delta from 'quill-delta';
import Block from '../blots/block';
import Break from '../blots/break';
import Cursor from '../blots/cursor';
import Inline from '../blots/inline';
import TextBlot from '../blots/text';
import Container from '../blots/container';

class Code extends Inline {}
Code.blotName = 'code';
Code.tagName = 'CODE';

class CodeBlock extends Block {
  delta() {
    if (this.cache.delta == null) {
      this.cache.delta = new Delta()
        .insert(this.domNode.textContent)
        .insert('\n', this.formats());
    }
    return this.cache.delta;
  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.className = 'ql-code-block';
CodeBlock.tagName = 'DIV';

class CodeBlockContainer extends Container {
  static create(value) {
    const domNode = super.create(value);
    domNode.setAttribute('spellcheck', false);
    return domNode;
  }
}
CodeBlockContainer.blotName = 'code-block-container';
CodeBlockContainer.className = 'ql-code-block-container';
CodeBlockContainer.tagName = 'DIV';

CodeBlockContainer.allowedChildren = [CodeBlock];

CodeBlock.allowedChildren = [TextBlot, Break, Cursor];
CodeBlock.requiredContainer = CodeBlockContainer;
CodeBlock.TAB = '  ';

export { Code, CodeBlockContainer, CodeBlock as default };
