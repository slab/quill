import { EmbedBlot, InlineBlot, Scope } from 'parchment';
import Break from './break';
import Text from './text';

class Inline extends InlineBlot {
  static compare(self, other) {
    const selfIndex = Inline.order.indexOf(self);
    const otherIndex = Inline.order.indexOf(other);
    if (selfIndex >= 0 || otherIndex >= 0) {
      return selfIndex - otherIndex;
    }
    if (self === other) {
      return 0;
    }
    if (self < other) {
      return -1;
    }
    return 1;
  }

  formatAt(index, length, name, value) {
    if (
      Inline.compare(this.statics.blotName, name) < 0 &&
      this.scroll.query(name, Scope.BLOT)
    ) {
      const blot = this.isolate(index, length);
      if (value) {
        blot.wrap(name, value);
      }
    } else {
      super.formatAt(index, length, name, value);
    }
  }

  optimize(context) {
    super.optimize(context);
    if (
      this.parent instanceof Inline &&
      Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0
    ) {
      const parent = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(parent);
      parent.wrap(this);
    }
  }
}
Inline.allowedChildren = [Inline, Break, EmbedBlot, Text];
// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
Inline.order = [
  'cursor',
  'inline', // Must be lower
  'underline',
  'strike',
  'italic',
  'bold',
  'script',
  'link',
  'code', // Must be higher
];

export default Inline;
