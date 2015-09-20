import Parchment from 'parchment';
import StyleAttributor from './attributor';


class BlockAttributor extends StyleAttributor {
  add(node, value) {
    let blot = Parchment.findBlot(node);
    if (blot instanceof Parchment.Block) {
      super.add(node, value);
    }
  }
}

let Align = new BlockAttributor('align', 'text-align', {
  default: 'left',
  whitelist: ['left', 'right', 'center', 'justify']
});

let Direction = new BlockAttributor('direction', 'direction', {
  default: 'ltr',
  whitelist: ['ltr', 'rtl']
});

Parchment.register(Align);
Parchment.register(Direction);

export { Align, Direction };
