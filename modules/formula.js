import Embed from '../blots/embed';
import Quill from '../core/quill';


class FormulaBlot extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      katex.render(value, node);
      node.setAttribute('data-value', value);
    }
    node.setAttribute('contenteditable', false);
    return node;
  }

  static value(domNode) {
    return domNode.getAttribute('data-value');
  }

  index(node, offset) {
    return 1;
  }
}
FormulaBlot.blotName = 'formula';
FormulaBlot.className = 'ql-formula';
FormulaBlot.tagName = 'SPAN';


function Formula() {
  if (window.katex == null) {
    throw new Error('Formula module requires KaTeX.');
  }
  Quill.register(FormulaBlot, true);
}


export { FormulaBlot, Formula as default };
