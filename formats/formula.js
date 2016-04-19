import Embed from '../blots/embed';


class Formula extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      katex.render(value, node);
      node.dataset.value = value;
    }
    node.setAttribute('contenteditable', false);
    return node;
  }

  static value(domNode) {
    return domNode.dataset.value;
  }
}
Formula.blotName = 'formula';
Formula.className = 'ql-formula';
Formula.tagName = 'SPAN';


export default Formula;
