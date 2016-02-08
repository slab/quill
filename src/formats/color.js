import Parchment from 'parchment';

let Color = new Parchment.Attributor.Style('color', 'color', {
  scope: Parchment.Scope.INLINE
});

export default Color;
