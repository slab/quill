import Inline from '../blots/inline';
import Quill from '../core/quill';
import Module from '../core/module';
import TextBlot from '../blots/text';
import CodeBlock, { CodeBlockContainer } from '../formats/code';

const CODE_TOKEN_CLASS = 'ql-token';

class SyntaxCodeBlock extends CodeBlock {
  replaceWith(block) {
    this.domNode.textContent = this.domNode.textContent; // Get rid of code tokens
    this.attach();
    super.replaceWith(block);
  }
}

class SyntaxCodeBlockContainer extends CodeBlockContainer {
  highlight(highlight) {
    const text = Array.from(this.domNode.childNodes)
      .map(node => node.textContent)
      .join('\n');
    if (this.cachedText !== text) {
      if (text.trim().length > 0 || this.cachedText == null) {
        const html = highlight(text)
          .split('\n')
          .map(
            line =>
              `<${SyntaxCodeBlock.tagName} class="${
                SyntaxCodeBlock.className
              }">${line}</${SyntaxCodeBlock.tagName}>`,
          )
          .join('');
        this.domNode.innerHTML = html;
        this.domNode.normalize();
        Array.from(this.domNode.querySelectorAll('span')).forEach(token => {
          token.classList.add(CODE_TOKEN_CLASS);
        });
        this.attach();
      }
      this.cachedText = text;
    }
  }
}

class CodeToken extends Inline {
  static formats(node) {
    while (node != null) {
      const parent = Quill.find(node);
      if (parent instanceof SyntaxCodeBlock) {
        return true;
      }
      node = node.parentNode;
    }
    return undefined;
  }
}
CodeToken.blotName = 'code-token';
CodeToken.className = CODE_TOKEN_CLASS;

SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, TextBlot];

class Syntax extends Module {
  static register() {
    Quill.register(CodeToken, true);
    Quill.register(SyntaxCodeBlock, true);
    Quill.register(SyntaxCodeBlockContainer, true);
  }

  constructor(quill, options) {
    super(quill, options);
    if (typeof this.options.highlight !== 'function') {
      throw new Error(
        'Syntax module requires highlight.js. Please include the library on the page before Quill.',
      );
    }
    let timer = null;
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.highlight();
        timer = null;
      }, this.options.interval);
    });
    this.highlight();
  }

  highlight() {
    if (this.quill.selection.composing) return;
    this.quill.update(Quill.sources.USER);
    const range = this.quill.getSelection();
    this.quill.scroll.descendants(SyntaxCodeBlockContainer).forEach(code => {
      code.highlight(this.options.highlight);
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }
}
Syntax.DEFAULTS = {
  highlight: (() => {
    if (window.hljs == null) return null;
    return (text, subset) => {
      const result = window.hljs.highlightAuto(text, subset);
      return result.value;
    };
  })(),
  interval: 1000,
};

export { SyntaxCodeBlock as CodeBlock, CodeToken, Syntax as default };
