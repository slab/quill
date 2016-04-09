import Parchment from 'parchment';
import Quill from 'quill/core';
import Module from 'quill/core/module';
import CodeBlock from 'quill/formats/code';


class HighlightCodeBlock extends CodeBlock {
  static create(value) {
    let domNode = super.create(domNode);
    if (typeof value === 'string') {
      domNode.dataset.language = value;
    } else {
      domNode.dataset.language = HighlightCodeBlock.DEFAULT_LANGUAGE;
    }
    domNode.classList.add(domNode.dataset.language);
    return domNode;
  }

  static formats(domNode) {
    return domNode.dataset.language || HighlightCodeBlock.DEFAULT_LANGUAGE;
  }

  highlight() {
    if (this.cachedHTML !== this.domNode.innerHTML) {
      let text = this.domNode.textContent;
      if (text.trim().length > 0 || this.cachedHTML == null) {
        this.domNode.textContent = this.domNode.textContent;
        hljs.highlightBlock(this.domNode);
        this.attach();
      }
      this.cachedHTML = this.domNode.innerHTML;
    }
  }
}
HighlightCodeBlock.DEFAULT_LANGUAGE = 'javascript';


let CodeToken = new Parchment.Attributor.Class('token', 'hljs', {
  scope: Parchment.Scope.INLINE
});


class CodeHighlighter extends Module {
  constructor(quill, options) {
    super(quill, options);
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
    let range = this.quill.getSelection();
    this.quill.scroll.descendants(HighlightCodeBlock).forEach(function(code) {
      code.highlight();
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }
}


export { HighlightCodeBlock as CodeBlock, CodeToken, CodeHighlighter as default};
