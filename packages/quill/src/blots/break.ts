import { EmbedBlot, ParentBlot } from 'parchment';
import SoftBreak from './soft-break.js';
import { getLastLeafInParent } from './block.js';

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
        ? getLastLeafInParent(this.prev)
        : this.prev;
    const prevLeafIsSoftBreak =
      prevLeaf != null && prevLeaf.statics.blotName == SoftBreak.blotName;
    const shouldRender = thisIsOnlyBlotInParent || prevLeafIsSoftBreak;
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
