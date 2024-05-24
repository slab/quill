import Delta from 'quill-delta';
import Module from '../core/module.js';
import Quill from '../core/quill.js';
import CursorBlot from '../blots/cursor.js';
import type { Range } from '../core/selection.js';
import { deleteRange } from './keyboard.js';
import Embed from '../blots/embed.js';

const INSERT_TYPES = ['insertText', 'insertReplacementText'];

class Cursor extends Module {
  constructor(quill: Quill, options: Record<string, never>) {
    super(quill, options);

    quill.root.addEventListener('beforeinput', (event) => {
      this.handleBeforeInput(event);
    });

    quill.emitter.on(Quill.events.COMPOSITION_END, () => {
      this.quill.update(Quill.sources.USER);

      const selection = document.getSelection();
      if (selection == null || selection.rangeCount <= 0) return null;
      const node = selection.getRangeAt(0).startContainer;
      const blot = quill.scroll.find(node, true);
      if (blot instanceof CursorBlot) {
        this.restoreCursor(blot, blot.resetText());
      }
    });
  }

  private restoreCursor(cursor: CursorBlot, text: string) {
    const offset = cursor.offset(this.quill.scroll);
    const formats = this.quill.getFormat(offset);
    this.quill.insertText(offset, text, formats, Quill.sources.USER);
    cursor.remove();
    this.quill.update(Quill.sources.SILENT);
    this.quill.setSelection(offset + text.length, 0, Quill.sources.SILENT);
  }

  private restoreEmbed(embed: Embed, side: 'left' | 'right', text: string) {
    const offset = embed.offset(this.quill.scroll) + (side === 'left' ? 0 : 1);
    const formats = this.quill.getFormat(offset);
    this.quill.insertText(offset, text, formats, Quill.sources.USER);
    this.quill.update(Quill.sources.SILENT);
    this.quill.setSelection(offset + text.length, 0, Quill.sources.SILENT);
  }

  private handleBeforeInput(event: InputEvent) {
    if (this.quill.composition.isComposing || event.defaultPrevented) {
      return;
    }

    if (event.inputType !== 'insertText') {
      return;
    }

    const staticRange = event.getTargetRanges
      ? event.getTargetRanges()[0]
      : null;
    if (!staticRange || !staticRange.collapsed) {
      return;
    }

    const text = getPlainTextFromInputEvent(event);
    if (text == null) {
      return;
    }

    const blot = this.quill.scroll.find(staticRange.startContainer, true);
    console.log(blot);

    this.quill.update(Quill.sources.USER);

    if (blot instanceof CursorBlot) {
      this.restoreCursor(blot, text);
      event.preventDefault();
    } else if (blot instanceof Embed) {
      this.restoreEmbed(
        blot,
        blot.leftGuard === staticRange.startContainer ? 'left' : 'right',
        text,
      );
      event.preventDefault();
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
