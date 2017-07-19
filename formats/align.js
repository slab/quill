import Parchment from 'parchment';

let config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['right', 'center', 'justify']
};

let AlignAttribute = new Parchment.Attributor.Attribute('align', 'align', config);
let AlignClass = new Parchment.Attributor.Class('align', 'ql-align', config);
let AlignStyle = new Parchment.Attributor.Style('align', 'text-align', config);

export { AlignAttribute, AlignClass, AlignStyle };
