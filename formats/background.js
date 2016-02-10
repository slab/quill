import Parchment from 'parchment';

let BackgroundClass = new Parchment.Attributor.Class('background', 'ql-bg', {
  scope: Parchment.Scope.INLINE
});
let BackgroundStyle = new Parchment.Attributor.Style('background', 'background-color', {
  scope: Parchment.Scope.INLINE
});

export { BackgroundClass, BackgroundStyle };
