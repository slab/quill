import Parchment from 'parchment';


class Break extends Parchment.Embed {
  getLength() {
    return 0;
  }

  getValue() {
    return '';
  }
}
Break.blotName = 'break';
Break.tagName = 'BR';


Parchment.register(Break);

export { Break as default };
