import Embed from '../blots/embed.js';
class Formula extends Embed {
  static blotName = 'formula';
  static className = 'ql-formula';
  static tagName = 'SPAN';
  static create(value) {
    // @ts-expect-error
    if (window.katex == null) {
      throw new Error('Formula module requires KaTeX.');
    }
    const node = super.create(value);
    if (typeof value === 'string') {
      // @ts-expect-error
      window.katex.render(value, node, {
        throwOnError: false,
        errorColor: '#f00'
      });
      node.setAttribute('data-value', value);
    }
    return node;
  }
  static value(domNode) {
    return domNode.getAttribute('data-value');
  }
  html() {
    const {
      formula
    } = this.value();
    return `<span>${formula}</span>`;
  }
}
export default Formula;
//# sourceMappingURL=formula.js.map