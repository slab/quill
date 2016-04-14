import Parchment from 'parchment';
import { ColorAttributor } from './color';

let BackgroundClass = new Parchment.Attributor.Class('background', 'ql-bg', {
  scope: Parchment.Scope.INLINE
});
let BackgroundStyle = new ColorAttributor('background', 'background-color', {
  scope: Parchment.Scope.INLINE
});

export { BackgroundClass, BackgroundStyle };
