import { isEqual } from 'lodash-es';
import Module from '../core/module.js';
import Quill from '../core/quill.js';
import type { Range } from '../core/selection.js';

const INSERT_TYPES = new Set([
  'insertText',
  'insertFromPaste',
  'insertFromPasteAsQuotation',
  'insertFromDrop',
  'insertTranspose',
  'insertReplacementText',
  'insertFromYank',
]);

class Cursor extends Module {
  constructor(quill: Quill, options: Record<string, never>) {
    super(quill, options);

    quill.root.addEventListener('beforeinput', (event) => {
      this.handleBeforeInput(event);
    });

    quill.emitter.on(Quill.events.COMPOSITION_END, () => {
      this.handleCompositionEnd();
    });

    quill.on(Quill.events.SELECTION_CHANGE, (range) => {
      this.handleSelectionChange(range);
    });
  }

  private restoreCursor(text: string) {
    const { cursor } = this.quill.selection;
    this.quill.update(Quill.sources.USER);
    const offset = cursor.offset(this.quill.scroll);
    const formats = this.quill.getFormat(offset);
    this.quill.insertText(offset, text, formats, Quill.sources.USER);
    cursor.remove();
    this.quill.update(Quill.sources.SILENT);
    this.quill.setSelection(offset + text.length, 0, Quill.sources.SILENT);
  }

  private handleBeforeInput(event: InputEvent) {
    if (
      this.quill.composition.isComposing ||
      event.defaultPrevented ||
      !this.quill.selection.cursor.parent ||
      !event.cancelable
    ) {
      return;
    }

    if (INSERT_TYPES.has(event.inputType)) {
      const text = getPlainTextFromInputEvent(event);
      if (text) {
        const staticRange = event.getTargetRanges
          ? event.getTargetRanges()[0]
          : null;

        if (
          staticRange?.startContainer === this.quill.selection.cursor.textNode
        ) {
          this.restoreCursor(text);
          event.preventDefault();
          return;
        }
      }
    }

    this.restoreCursor('');
  }

  private handleCompositionEnd() {
    const selection = document.getSelection();
    if (selection == null || selection.rangeCount <= 0) return null;
    const range = selection.getRangeAt(0);

    if (range.startContainer === this.quill.selection.cursor.textNode) {
      this.restoreCursor(this.quill.selection.cursor.resetText());
    }
  }

  private handleSelectionChange(range: Range) {
    if (this.quill.selection.cursor.parent) {
      this.quill.selection.cursor.remove();
      const newRange = this.quill.getSelection();
      if (!isEqual(newRange, range)) {
        this.quill.setSelection(range, Quill.sources.SILENT);
      }
    }
  }
}

function getPlainTextFromInputEvent(event: InputEvent) {
  // When `inputType` is "insertText":
  // - `event.data` should be string (Safari uses `event.dataTransfer`).
  // - `event.dataTransfer` should be null.
  // When `inputType` is "insertReplacementText":
  // - `event.data` should be null.
  // - `event.dataTransfer` should contain "text/plain" data.

  if (typeof event.data === 'string') {
    return event.data;
  }
  if (event.dataTransfer?.types.includes('text/plain')) {
    return event.dataTransfer.getData('text/plain');
  }
  return null;
}

export default Cursor;
