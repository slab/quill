import Block from '../blots/block';
import Break from '../blots/break';
import Cursor from '../blots/cursor';
import Inline from '../blots/inline';
import TextBlot, { escapeText } from '../blots/text';
import Container from '../blots/container';
import Quill from '../core/quill';

class CodeBlockContainer extends Container {
  static create(value) {
    const domNode = super.create(value);
    domNode.setAttribute('spellcheck', false);
    return domNode;
  }

  html(index, length) {
    let text = this.domNode.innerText;
    // TODO find more robust solution for <select> turning into \n
    if (text.startsWith('\n')) {
      text = text.slice(1);
    }
    text = text.slice(index, index + length);
    return `<pre>${escapeText(text)}</pre>`;
  }
}

class CodeBlock extends Block {
  static register() {
    Quill.register(CodeBlockContainer);
  }
}

class Code extends Inline {}
Code.blotName = 'code';
Code.tagName = 'CODE';

CodeBlock.blotName = 'code-block';
CodeBlock.className = 'ql-code-block';
CodeBlock.tagName = 'DIV';
CodeBlockContainer.blotName = 'code-block-container';
CodeBlockContainer.className = 'ql-code-block-container';
CodeBlockContainer.tagName = 'DIV';

CodeBlockContainer.allowedChildren = [CodeBlock];

CodeBlock.allowedChildren = [TextBlot, Break, Cursor];
CodeBlock.requiredContainer = CodeBlockContainer;
CodeBlock.TAB = '  ';

export { Code, CodeBlockContainer, CodeBlock as default };
