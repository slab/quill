import Embed from '../blots/embed.js';
import { escapeHtml } from '../core/html_escape.js';

class Formula extends Embed {
  static blotName = 'formula';
  static className = 'ql-formula';
  static tagName = 'SPAN';

  static create(value: string) {
    // @ts-expect-error
    if (window.katex == null) {
      throw new Error('Formula module requires KaTeX.');
    }
    const node = super.create(value) as Element;
    if (typeof value === 'string') {
      // @ts-expect-error
      window.katex.render(value, node, {
        throwOnError: false,
        errorColor: '#f00',
      });
      node.setAttribute('data-value', value);
    }
    return node;
  }

  static value(domNode: Element) {
    return domNode.getAttribute('data-value');
  }

  html() {
    const dom = this.domNode as Element;
    const raw =
      (typeof this.value() === 'string' ? this.value() : null) ??
      dom.getAttribute('data-value') ??
      '';
    return `<span class="ql-formula">${escapeHtml(raw)}</span>`;
  }
}

export default Formula;
