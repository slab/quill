import Embed from '../blots/embed';


class Formula extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      katex.render(value, node);
      node.dataset.value = value;
    }
    return node;
  }

  static value(domNode) {
    return domNode.dataset.value;
  }

  index(node, offset) {
    return 1;
  }
}
Formula.blotName = 'formula';
Formula.className = 'ql-formula';
Formula.tagName = 'SPAN';


export default Formula;
