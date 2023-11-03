import { ParentBlot } from 'parchment';
import Module from '../core/module';
import Quill from '../core/quill';

const isMac = /Mac/i.test(navigator.platform);

// A loose check to see if the shortcut can move the caret before a UI node:
// <ANY_PARENT>[CARET]<div class="ql-ui"></div>[CONTENT]</ANY_PARENT>
const canMoveCaretBeforeUINode = (event: KeyboardEvent) => {
  if (
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' || // RTL language or moving from the end of the previous line
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'Home'
  ) {
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

  constructor(quill: Quill, options: Record<string, never>) {
    super(quill, options);

    this.handleArrowKeys();
    this.handleNavigationShortcuts();
  }

  private handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: 'ArrowLeft',
      shiftKey: null,
      handler(range, { line, offset, event }) {
        if (offset === 0 && line instanceof ParentBlot && line.uiNode) {
          this.quill.setSelection(
            range.index - 1,
            range.length + (event.shiftKey ? 1 : 0),
            Quill.sources.USER,
          );
          return false;
        }
        return true;
      },
    });
  }

  private handleNavigationShortcuts() {
    this.quill.root.addEventListener('keydown', (event) => {
      if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
        this.ensureListeningToSelectionChange();
      }
    });
  }

  private ensureListeningToSelectionChange() {
    if (this.isListening) return;

    this.isListening = true;
    this.selectionChangeDeadline = Date.now() + 100;

    const listener = () => {
      this.isListening = false;

      if (Date.now() <= this.selectionChangeDeadline) {
        this.handleSelectionChange();
      }
    };

    document.addEventListener('selectionchange', listener, {
      once: true,
    });
  }

  private handleSelectionChange() {
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
