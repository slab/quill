import Parchment from 'parchment';

class ColorAttributor extends Parchment.Attributor.Style {
  value(domNode) {
    let value = super.value(domNode);
    if (!value.startsWith('rgb(')) return value;
    value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
    return '#' + value.split(',').map(function(component) {
      return ('00' + parseInt(component).toString(16)).slice(-2);
    }).join('');
  }
}

let ColorClass = new Parchment.Attributor.Class('color', 'ql-color', {
  scope: Parchment.Scope.INLINE
});
let ColorStyle = new ColorAttributor('color', 'color', {
  scope: Parchment.Scope.INLINE
});

export { ColorAttributor, ColorClass, ColorStyle };
