import Parchment from 'parchment';


class Break extends Parchment.Embed {
  length() {
    return 0;
  }

  value() {
    return '';
  }
}
Break.blotName = 'break';
Break.tagName = 'BR';


export default Break;
