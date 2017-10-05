import Embed from '../blots/embed';
import Quill from '../core/quill';
import Module from '../core/module';


class FormulaBlot extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
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
}
FormulaBlot.blotName = 'formula';
FormulaBlot.className = 'ql-formula';
FormulaBlot.tagName = 'SPAN';


class Formula extends Module {
  static register() {
    Quill.register(FormulaBlot, true);
  }

  constructor() {
    super();
    if (window.katex == null) {
      throw new Error('Formula module requires KaTeX.');
    }
  }
}


export { FormulaBlot, Formula as default };
