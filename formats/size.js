import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const SizeClass = new ClassAttributor('size', 'ql-size', {
  scope: Scope.INLINE,
  whitelist: ['small', 'large', 'huge'],
});
const SizeStyle = new StyleAttributor('size', 'font-size', {
  scope: Scope.INLINE,
  // yswang modify
  whitelist: ['9px', '10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '36px', '48px', '72px'],
});

export { SizeClass, SizeStyle };
