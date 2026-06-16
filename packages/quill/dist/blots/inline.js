import { EmbedBlot, InlineBlot, Scope } from 'parchment';
import Break from './break.js';
import Text from './text.js';
class Inline extends InlineBlot {
  static allowedChildren = [Inline, Break, EmbedBlot, Text];
  // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
  static order = ['cursor', 'inline',
  // Must be lower
  'link',
  // Chrome wants <a> to be lower
  'underline', 'strike', 'italic', 'bold', 'script', 'code' // Must be higher
  ];
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
    if (Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, Scope.BLOT)) {
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
    if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const parent = this.parent.isolate(this.offset(), this.length());
      // @ts-expect-error TODO: make isolate generic
      this.moveChildren(parent);
      parent.wrap(this);
    }
  }
}
export default Inline;
//# sourceMappingURL=inline.js.map