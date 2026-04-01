import Embed from '../blots/embed.js';
import { escapeText } from '../blots/text.js';

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

  domNode: HTMLElement;

  html() {
    const formula = Formula.value(this.domNode) || '';
    return `<span>${escapeText(formula)}</span>`;
  }
}

export default Formula;
