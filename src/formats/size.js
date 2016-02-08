import Parchment from 'parchment';

let Size = new Parchment.Attributor.Class('size', 'ql-size', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['small', 'large', 'huge']
});

export default Size;
