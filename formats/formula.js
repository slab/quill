import Parchment from 'parchment';


class Formula extends Parchment.Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      katex.render(value, node);
      node.setAttribute('data-value', value);
    }
    node.setAttribute('contenteditable', false);
    return node;
  }

  value() {
    return this.domNode.getAttribute('data-value') || true;
  }
}
Formula.blotName = 'formula';
Formula.className = 'ql-formula';
Formula.tagName = 'SPAN';


export default Formula;
