import Embed from '../blots/embed';


class Formula extends Embed {
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
Formula.tagName = 'SPAN';


export default Formula;
