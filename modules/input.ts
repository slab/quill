import Delta from 'quill-delta';
import Module from '../core/module';
import Quill from '../core/quill';
import type { Range } from '../core/selection';
import { deleteRange } from './keyboard';

const INSERT_TYPES = ['insertText', 'insertReplacementText'];

class Input extends Module {
  constructor(quill: Quill, options: Record<string, never>) {
    super(quill, options);

    quill.root.addEventListener('beforeinput', (event) => {
      this.handleBeforeInput(event);
    });

    // Gboard with English input on Android triggers `compositionstart` sometimes even
    // users are not going to type anything.
    if (!/Android/i.test(navigator.userAgent)) {
      quill.on(Quill.events.COMPOSITION_BEFORE_START, () => {
        this.handleCompositionStart();
      });
    }
  }

  private deleteRange(range: Range) {
    deleteRange({ range, quill: this.quill });
  }

  private replaceText(range: Range, text = '') {
    if (range.length === 0) return false;

    if (text) {
      // Follow the native behavior that inherits the formats of the first character
      const formats = this.quill.getFormat(range.index, 1);
      this.deleteRange(range);
      this.quill.updateContents(
        new Delta().retain(range.index).insert(text, formats),
        Quill.sources.USER,
      );
    } else {
      this.deleteRange(range);
    }

    this.quill.setSelection(range.index + text.length, 0, Quill.sources.SILENT);
    return true;
  }

  private handleBeforeInput(event: InputEvent) {
    if (
      this.quill.composition.isComposing ||
      event.defaultPrevented ||
      !INSERT_TYPES.includes(event.inputType)
    ) {
      return;
    }

    const staticRange = event.getTargetRanges
      ? event.getTargetRanges()[0]
      : null;
    if (!staticRange || staticRange.collapsed === true) {
      return;
    }

    const text = getPlainTextFromInputEvent(event);
    if (text == null) {
      return;
    }
    const normalized = this.quill.selection.normalizeNative(staticRange);
    const range = normalized
      ? this.quill.selection.normalizedToRange(normalized)
      : null;
    if (range && this.replaceText(range, text)) {
      event.preventDefault();
    }
  }

  private handleCompositionStart() {
    const range = this.quill.getSelection();
    if (range) {
      this.replaceText(range);
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

export default Input;
