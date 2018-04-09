import Inline from '../blots/inline';
import Quill from '../core/quill';
import Module from '../core/module';
import BreakBlot from '../blots/break';
import TextBlot from '../blots/text';
import CodeBlock, { CodeBlockContainer } from '../formats/code';

class SyntaxCodeBlock extends CodeBlock {
  static create(value) {
    const domNode = super.create(value);
    if (typeof value === 'string') {
      domNode.setAttribute('data-language', value);
    }
    return domNode;
  }

  static formats(domNode) {
    return domNode.getAttribute('data-language') || true;
  }

  format(name, value) {
    if (name !== this.statics.blotName) return;
    if (value === true) {
      this.domNode.removeAttribute('data-language');
    } else if (value) {
      this.domNode.setAttribute('data-language', value);
    } else {
      super.format(name, value);
    }
  }

  replaceWith(block) {
    this.domNode.textContent = this.domNode.textContent; // Get rid of code tokens
    this.attach();
    super.replaceWith(block);
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

class SyntaxCodeBlockContainer extends CodeBlockContainer {
  attach() {
    super.attach();
    this.scroll.emitMount(this);
  }

  format(name, value) {
    if (name === SyntaxCodeBlock.blotName) {
      this.children.forEach(child => {
        child.format(name, value);
      });
    }
  }

  highlight(highlight, forced = false) {
    if (this.children.head == null) return;
    const nodes = Array.from(this.domNode.childNodes).filter(
      node => node !== this.uiNode,
    );
    const text = nodes.map(node => node.textContent).join('\n');
    const language = SyntaxCodeBlock.formats(this.children.head.domNode);
    if (forced || this.cachedText !== text) {
      if (text.trim().length > 0 || this.cachedText == null) {
        const html = highlight(text, language)
          .split('\n')
          .map(
            line =>
              `<${SyntaxCodeBlock.tagName} class="${
                SyntaxCodeBlock.className
              }">${line}</${SyntaxCodeBlock.tagName}>`,
          )
          .join('');

        nodes.forEach(node => node.remove());
        this.domNode.insertAdjacentHTML('beforeend', html);
        this.domNode.normalize();
        Array.from(this.domNode.querySelectorAll('span')).forEach(token => {
          token.classList.add(CodeToken.className);
        });
        Array.from(
          this.domNode.querySelectorAll(`.${SyntaxCodeBlock.className}`),
        ).forEach(node => {
          if (language == null) {
            node.removeAttribute('data-language');
          } else {
            node.setAttribute('data-language', language);
          }
        });
        this.build();
        // this.scroll.observer.takeRecords();
      }
      this.cachedText = text;
    }
  }

  optimize(context) {
    super.optimize(context);
    if (
      this.parent != null &&
      this.children.head != null &&
      this.uiNode != null
    ) {
      const language = SyntaxCodeBlock.formats(this.children.head.domNode);
      if (language !== this.uiNode.value) {
        this.uiNode.value = language;
      }
    }
  }
}

CodeToken.blotName = 'code-token';
CodeToken.className = 'ql-token';

SyntaxCodeBlockContainer.allowedChildren = [SyntaxCodeBlock];
SyntaxCodeBlock.requiredContainer = SyntaxCodeBlockContainer;
SyntaxCodeBlock.allowedChildren = [CodeToken, TextBlot, BreakBlot];

class Syntax extends Module {
  static register() {
    Quill.register(CodeToken, true);
    Quill.register(SyntaxCodeBlock, true);
    Quill.register(SyntaxCodeBlockContainer, true);
  }

  constructor(quill, options) {
    super(quill, options);
    if (this.options.hljs == null) {
      throw new Error(
        'Syntax module requires highlight.js. Please include the library on the page before Quill.',
      );
    }
    this.highlightBlot = this.highlightBlot.bind(this);
    this.initListener();
    this.initTimer();
  }

  initListener() {
    this.quill.on(Quill.events.SCROLL_BLOT_MOUNT, blot => {
      if (!(blot instanceof SyntaxCodeBlockContainer)) return;
      const select = this.quill.root.ownerDocument.createElement('select');
      this.options.languages.forEach(({ key, label }) => {
        const option = select.ownerDocument.createElement('option');
        option.textContent = label;
        option.setAttribute('value', key);
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        blot.format(SyntaxCodeBlock.blotName, select.value);
        blot.highlight(this.highlightBlot, true);
      });
      if (blot.uiNode == null) {
        blot.attachUI(select);
        if (blot.children.head) {
          select.value = SyntaxCodeBlock.formats(blot.children.head.domNode);
        }
      }
    });
  }

  initTimer() {
    let timer = null;
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.highlight();
        timer = null;
      }, this.options.interval);
    });
  }

  highlight() {
    if (this.quill.selection.composing) return;
    this.quill.update(Quill.sources.USER);
    const range = this.quill.getSelection();
    this.quill.scroll.descendants(SyntaxCodeBlockContainer).forEach(blot => {
      blot.highlight(this.highlightBlot);
    });
    this.quill.update(Quill.sources.SILENT);
    if (range != null) {
      this.quill.setSelection(range, Quill.sources.SILENT);
    }
  }

  highlightBlot(text, language = true) {
    const { value } =
      typeof language === 'string'
        ? this.options.hljs.highlight(language, text)
        : this.options.hljs.highlightAuto(text);
    return value;
  }
}
Syntax.DEFAULTS = {
  hljs: (() => {
    return window.hljs;
  })(),
  interval: 1000,
  languages: [
    { key: 'bash', label: 'Bash' },
    { key: 'cpp', label: 'C++' },
    { key: 'cs', label: 'C#' },
    { key: 'css', label: 'CSS' },
    { key: 'diff', label: 'Diff' },
    { key: 'xml', label: 'HTML/XML' },
    { key: 'java', label: 'Java' },
    { key: 'javascript', label: 'Javascript' },
    { key: 'markdown', label: 'Markdown' },
    { key: 'php', label: 'PHP' },
    { key: 'python', label: 'Python' },
    { key: 'ruby', label: 'Ruby' },
    { key: 'sql', label: 'SQL' },
  ],
};

export { SyntaxCodeBlock as CodeBlock, CodeToken, Syntax as default };
