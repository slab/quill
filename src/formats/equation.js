import Parchment from 'parchment';


class Equation extends Parchment.Embed {
  constructor(value) {
    super(value);
    if (typeof value === 'string') {
      katex.render(value, this.domNode);
      this.domNode.setAttribute('data-value', value);
    }
    this.domNode.setAttribute('contenteditable', false);
  }

  getValue() {
    return { equation: this.domNode.getAttribute('data-value') };
  }
}
Equation.blotName = 'equation';
Equation.tagName = 'SPAN';


Parchment.register(Equation, false);

export { Equation as default };
