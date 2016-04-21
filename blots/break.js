import Embed from './embed';


class Break extends Embed {
  static value(domNode) {
    return undefined;
  }

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
