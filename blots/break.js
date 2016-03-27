import Parchment from 'parchment';


class Break extends Parchment.Leaf {
  insertInto(parent, ref) {
    if (parent.children.length === 0) {
      super.insertInto(parent, ref);
    }
  }

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
