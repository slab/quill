import Parchment from 'parchment';

class ColorAttributor extends Parchment.Attributor.Style {
  value(domNode) {
    let value = super.value(domNode);
    if (!value.startsWith('rgb(')) return value;
    value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
    const hex = value
      .split(',')
      .map(component => `00${parseInt(component, 10).toString(16)}`.slice(-2))
      .join('');
    return `#${hex}`;
  }
}

const ColorClass = new Parchment.Attributor.Class('color', 'ql-color', {
  scope: Parchment.Scope.INLINE,
});
const ColorStyle = new ColorAttributor('color', 'color', {
  scope: Parchment.Scope.INLINE,
});

export { ColorAttributor, ColorClass, ColorStyle };
