import Parchment from 'parchment';

const config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['rtl'],
};

const DirectionAttribute = new Parchment.Attributor.Attribute(
  'direction',
  'dir',
  config,
);
const DirectionClass = new Parchment.Attributor.Class(
  'direction',
  'ql-direction',
  config,
);
const DirectionStyle = new Parchment.Attributor.Style(
  'direction',
  'direction',
  config,
);

export { DirectionAttribute, DirectionClass, DirectionStyle };
