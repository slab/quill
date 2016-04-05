import Parchment from 'parchment';
import Emitter from 'quill/emitter';
import Module from 'quill/module';
import CodeBlock from 'quill/formats/code';


class HighlightCodeBlock extends CodeBlock {
  highlight() {
    if (this.cachedHTML !== this.domNode.innerHTML) {
      let text = this.domNode.textContent;
      if (text.trim().length > 0) {
        this.domNode.textContent = this.domNode.textContent;
        hljs.highlightBlock(this.domNode);
        this.attach();
      }
      this.cachedHTML = this.domNode.innerHTML;
    }
  }
}


let CodeToken = new Parchment.Attributor.Class('token', 'hljs', {
  scope: Parchment.Scope.INLINE
});


class CodeHighlighter extends Module {
  constructor(quill, options) {
    super(quill, options);
    let timer = null;
    this.quill.on(Emitter.events.SCROLL_OPTIMIZE, () => {
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
    if (range != null) {
      this.quill.setSelection(range, Emitter.sources.SILENT);
    }
  }
}


export { HighlightCodeBlock as CodeBlock, CodeToken, CodeHighlighter as default};
