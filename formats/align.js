import Parchment from 'parchment';

let Align = new Parchment.Attributor.Style('align', 'text-align', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['right', 'center', 'justify']
});

export default Align;
