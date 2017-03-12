import Parchment from 'parchment';
import Quill from '../core/quill';
import Module from '../core/module';
import CodeBlock from '../formats/code';


class SyntaxCodeBlock extends CodeBlock {
  replaceWith(block) {
    this.domNode.textContent = this.domNode.textContent;
    this.attach();
    super.replaceWith(block);
  }

  highlight(highlight) {
    if (this.cachedHTML !== this.domNode.innerHTML) {
      let text = this.domNode.textContent;
      if (text.trim().length > 0 || this.cachedHTML == null) {
        this.domNode.innerHTML = highlight(text);
        this.attach();
      }
      this.cachedHTML = this.domNode.innerHTML;
    }
  }
}
SyntaxCodeBlock.className = 'ql-syntax';


let CodeToken = new Parchment.Attributor.Class('token', 'hljs', {
  scope: Parchment.Scope.INLINE
});


class Syntax extends Module {
  static register() {
    Quill.register(CodeToken, true);
    Quill.register(SyntaxCodeBlock, true);
  }

  constructor(quill, options) {
    super(quill, options);
    if (typeof this.options.highlight !== 'function') {
      throw new Error('Syntax module requires highlight.js. Please include the library on the page before Quill.');
    }
    let timer = null;
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      if (timer != null) return;
      timer = setTimeout(() => {
        this.highlight();
        timer = null;
      }, 100);
    });
    this.highlight();
  }

  highlight() {
    if (this.quill.selection.composing) return;
    let range = this.quill.getSelection();
    this.quill.scroll.descendants(SyntaxCodeBlock).forEach((code) => {
      code.highlight(this.options.highlight);
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }
}
Syntax.DEFAULTS = {
  highlight: (function() {
    if (window.hljs == null) return null;
    return function(text) {
      let result = window.hljs.highlightAuto(text);
      return result.value;
    };
  })()
};


export { SyntaxCodeBlock as CodeBlock, CodeToken, Syntax as default};
