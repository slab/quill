import Parchment from 'parchment';

let Background = new Parchment.Attributor.Style('background', 'background-color', {
  scope: Parchment.Scope.INLINE
});

export default Background;
