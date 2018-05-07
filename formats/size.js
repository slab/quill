import Parchment, { ClassAttributor, StyleAttributor } from 'parchment';

const SizeClass = new ClassAttributor('size', 'ql-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['small', 'large', 'huge'],
});
const SizeStyle = new StyleAttributor('size', 'font-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['10px', '18px', '32px'],
});

export { SizeClass, SizeStyle };
