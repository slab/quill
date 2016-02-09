import Parchment from 'parchment';

let Font = new Parchment.Attributor.Class('font', 'ql-font', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['serif', 'monospace']
});

export default Font;
