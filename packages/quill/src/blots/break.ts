import { EmbedBlot, LeafBlot, ParentBlot } from 'parchment';
import SoftBreak from './soft-break.js';

class Break extends EmbedBlot {
  static value() {
    return undefined;
  }

  optimize(): void {
    const thisIsLastBlotInParent = this.next == null;
    const thisIsFirstBlotInParent = this.prev == null;
    const thisIsOnlyBlotInParent =
      thisIsLastBlotInParent && thisIsFirstBlotInParent;
    const prevLeaf =
      this.prev instanceof ParentBlot
        ? this.prev.descendants(LeafBlot).at(-1)
        : this.prev;
    const prevLeafIsSoftBreak =
      prevLeaf != null && prevLeaf.statics.blotName == SoftBreak.blotName;
    const shouldRender =  thisIsOnlyBlotInParent || (thisIsLastBlotInParent && prevLeafIsSoftBreak);
    if (!shouldRender) {
      this.remove();
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
