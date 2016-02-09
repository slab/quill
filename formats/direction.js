import Parchment from 'parchment';

let Direction = new Parchment.Attributor.Style('direction', 'direction', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['rtl']
});

export default Direction;
