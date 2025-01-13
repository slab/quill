import { EmbedBlot } from 'parchment';
import SoftBreak from './soft-break';

class Break extends EmbedBlot {
  static value() {
    return undefined;
  }

  optimize(): void {
    const thisIsLastBlotInParent = this.next == null;
    const noPrevBlots = this.prev == null;
    const prevBlotIsSoftBreak = this.prev != null && this.prev.statics.blotName == SoftBreak.blotName;
    const shouldRender = thisIsLastBlotInParent && (noPrevBlots || prevBlotIsSoftBreak)
    if (!shouldRender) {
        this.remove()
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
