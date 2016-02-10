import Parchment from 'parchment';

let ColorClass = new Parchment.Attributor.Class('color', 'ql-color', {
  scope: Parchment.Scope.INLINE
});
let ColorStyle = new Parchment.Attributor.Style('color', 'color', {
  scope: Parchment.Scope.INLINE
});

export { ColorClass, ColorStyle };
