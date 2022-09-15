import { Attributor, ClassAttributor, Scope, StyleAttributor } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['right', 'center', 'justify'],
};

const AlignAttribute = new Attributor('align', 'align', config);
const AlignClass = new ClassAttributor('align', 'ql-align', config);
const AlignStyle = new StyleAttributor('align', 'text-align', config);

export { AlignAttribute, AlignClass, AlignStyle };
