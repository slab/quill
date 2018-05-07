import Parchment, { ClassAttributor } from 'parchment';
import { ColorAttributor } from './color';

const BackgroundClass = new ClassAttributor('background', 'ql-bg', {
  scope: Parchment.Scope.INLINE,
});
const BackgroundStyle = new ColorAttributor('background', 'background-color', {
  scope: Parchment.Scope.INLINE,
});

export { BackgroundClass, BackgroundStyle };
