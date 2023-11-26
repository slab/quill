import '../../../src/quill';
import { describe, expect, test } from 'vitest';
import UINode, {
  TTL_FOR_VALID_SELECTION_CHANGE,
} from '../../../src/modules/uiNode';
import Quill, { Delta } from '../../../src/core';

// Fake timer is not supported in browser mode yet.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('uiNode', () => {
  test('extends deadline when multiple possible shortcuts are pressed', async () => {
    const quill = new Quill(document.createElement('div'));
    document.body.appendChild(quill.container);
    quill.setContents(
      new Delta().insert('item 1').insert('\n', { list: 'bullet' }),
    );
    new UINode(quill, {});

    for (let i = 0; i < 2; i += 1) {
      quill.root.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', metaKey: true }),
      );
      await delay(TTL_FOR_VALID_SELECTION_CHANGE / 2);
    }

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', metaKey: true }),
    );
    const range = document.createRange();
    range.setStart(quill.root.querySelector('li')!, 0);
    range.setEnd(quill.root.querySelector('li')!, 0);

    const selection = document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    await delay(TTL_FOR_VALID_SELECTION_CHANGE / 2);
    expect(selection?.getRangeAt(0).startOffset).toEqual(1);
  });
});
