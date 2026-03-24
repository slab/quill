import { EmbedBlot } from 'parchment';

class Break extends EmbedBlot {
  static value() {
    return undefined;
  }

  optimize() {
    if (this.prev || this.next) {
      this.remove();
    }
  }

  length() {
    return 0;
  }

  value() {
    return '';
  }

  html() {
    return '<br>';
  }
}
Break.blotName = 'break';
Break.tagName = 'BR';

export default Break;
