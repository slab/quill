import { ParentBlot } from 'parchment';
import Module from '../core/module.js';
import Quill from '../core/quill.js';
const isMac = /Mac/i.test(navigator.platform);

// Export for testing
export const TTL_FOR_VALID_SELECTION_CHANGE = 100;

// A loose check to determine if the shortcut can move the caret before a UI node:
// <ANY_PARENT>[CARET]<div class="ql-ui"></div>[CONTENT]</ANY_PARENT>
const canMoveCaretBeforeUINode = event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
  // RTL scripts or moving from the end of the previous line
  event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Home') {
    return true;
  }
  if (isMac && event.key === 'a' && event.ctrlKey === true) {
    return true;
  }
  return false;
};
class UINode extends Module {
  isListening = false;
  selectionChangeDeadline = 0;
  constructor(quill, options) {
    super(quill, options);
    this.handleArrowKeys();
    this.handleNavigationShortcuts();
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ['ArrowLeft', 'ArrowRight'],
      offset: 0,
      shiftKey: null,
      handler(range, _ref) {
        let {
          line,
          event
        } = _ref;
        if (!(line instanceof ParentBlot) || !line.uiNode) {
          return true;
        }
        const isRTL = getComputedStyle(line.domNode)['direction'] === 'rtl';
        if (isRTL && event.key !== 'ArrowRight' || !isRTL && event.key !== 'ArrowLeft') {
          return true;
        }
        this.quill.setSelection(range.index - 1, range.length + (event.shiftKey ? 1 : 0), Quill.sources.USER);
        return false;
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener('keydown', event => {
      if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
        this.ensureListeningToSelectionChange();
      }
    });
  }

  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
    if (this.isListening) return;
    this.isListening = true;
    const listener = () => {
      this.isListening = false;
      if (Date.now() <= this.selectionChangeDeadline) {
        this.handleSelectionChange();
      }
    };
    document.addEventListener('selectionchange', listener, {
      once: true
    });
  }
  handleSelectionChange() {
    const selection = document.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed !== true || range.startOffset !== 0) return;
    const line = this.quill.scroll.find(range.startContainer);
    if (!(line instanceof ParentBlot) || !line.uiNode) return;
    const newRange = document.createRange();
    newRange.setStartAfter(line.uiNode);
    newRange.setEndAfter(line.uiNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}
export default UINode;
//# sourceMappingURL=uiNode.js.map