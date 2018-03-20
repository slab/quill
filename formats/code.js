import Block from '../blots/block';
import Inline from '../blots/inline';
import Container from '../blots/container';

class Code extends Inline {}
Code.blotName = 'code';
Code.tagName = 'CODE';

class CodeBlock extends Block {}
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
CodeBlock.requiredContainer = CodeBlockContainer;
CodeBlock.TAB = '  ';

export { Code, CodeBlockContainer, CodeBlock as default };
