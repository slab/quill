import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';
import logger from '../logger';
import Block from '../blots/block';
import Inline from '../blots/inline';


let debug = logger('quill:code-block');


class Code extends Inline { }
Code.blotName = 'code';
Code.tagName = 'CODE';


class TokenAttributor extends Parchment.Attributor.Class {
  value(domNode) {
    return undefined;
  }
}

let CodeToken = new TokenAttributor('token', 'hljs', {
  scope: Parchment.Scope.INLINE
});


class CodeBlock extends Block {
  format(name, value) {
    // TODO allow changing language
    debug.warn(`format(${name}, ${value}) called on code block`);
  }

  formatAt(index, length, name, value) {
    debug.warn(`formatAt(${index}, ${length}, ${name}, ${value}) called on code block`);
  }

  formats() {
    return {
      'code-block': this.domNode.getAttribute('data-language') || true
    };
  }

  getDelta() {
    return this.domNode.innerText.split('\n').reduce((delta, text) => {
      return delta.insert(text).insert('\n', this.formats());
    }, new Delta());
  }

  highlight() {
    if (this.domNode.innerHTML === this.html) return;
    this.domNode.innerHTML = this.domNode.innerText;
    hljs.highlightBlock(this.domNode);
    this.build();
    this.html = this.domNode.innerHTML;
  }

  optimize(mutations) {
    super.optimize(mutations);
    this.highlight();
  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.tagName = 'PRE';


// TODO fix
// Quill.registerFormat(Code);
// Quill.registerFormat(CodeBlock);
// Quill.registerFormat(CodeToken);


export { CodeToken, CodeBlock as default };
