import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

class ColorAttributor extends StyleAttributor {
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

const ColorClass = new ClassAttributor('color', 'ql-color', {
  scope: Scope.INLINE,
});
const ColorStyle = new ColorAttributor('color', 'color', {
  scope: Scope.INLINE,
});

export { ColorAttributor, ColorClass, ColorStyle };
