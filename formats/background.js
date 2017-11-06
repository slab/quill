import Parchment from 'parchment';
import { ColorAttributor } from './color';

const BackgroundClass = new Parchment.Attributor.Class('background', 'ql-bg', {
  scope: Parchment.Scope.INLINE,
});
const BackgroundStyle = new ColorAttributor('background', 'background-color', {
  scope: Parchment.Scope.INLINE,
});

export { BackgroundClass, BackgroundStyle };
