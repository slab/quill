import Parchment from 'parchment';

const config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['right', 'center', 'justify'],
};

const AlignAttribute = new Parchment.Attributor.Attribute(
  'align',
  'align',
  config,
);
const AlignClass = new Parchment.Attributor.Class('align', 'ql-align', config);
const AlignStyle = new Parchment.Attributor.Style(
  'align',
  'text-align',
  config,
);

export { AlignAttribute, AlignClass, AlignStyle };
