import Parchment from 'parchment';

let config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['rtl']
};

let DirectionClass = new Parchment.Attributor.Class('direction', 'ql-direction', config);
let DirectionStyle = new Parchment.Attributor.Style('direction', 'direction', config);

export { DirectionClass, DirectionStyle };
