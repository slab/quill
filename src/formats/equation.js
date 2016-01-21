import Parchment from 'parchment';
import Embed from '../blots/embed';


class Equation extends Embed {
  value() {
    return this.domNode.getAttribute('data-value') || true;
  }
}
Equation.blotName = 'equation';
Equation.tagName = 'SPAN';
Equation.create = function(value) {
  let node = Parchment.Embed.create.call(Equation);
  if (typeof value === 'string') {
    katex.render(value, node);
    node.setAttribute('data-value', value);
  }
  node.setAttribute('contenteditable', false);
  return node;
}


export default Equation;
