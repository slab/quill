import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const SizeClass = new ClassAttributor('size', 'ql-size', {
  scope: Scope.INLINE,
  whitelist: ['extra-small', 'small', 'medium', 'large'],
});
const SizeStyle = new StyleAttributor('size', 'font-size', {
  scope: Scope.INLINE,
  whitelist: ['10px', '18px', '32px'],
});

export { SizeClass, SizeStyle };
