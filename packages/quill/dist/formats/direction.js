import { Attributor, ClassAttributor, Scope, StyleAttributor } from 'parchment';
const config = {
  scope: Scope.BLOCK,
  whitelist: ['rtl']
};
const DirectionAttribute = new Attributor('direction', 'dir', config);
const DirectionClass = new ClassAttributor('direction', 'ql-direction', config);
const DirectionStyle = new StyleAttributor('direction', 'direction', config);
export { DirectionAttribute, DirectionClass, DirectionStyle };
//# sourceMappingURL=direction.js.map