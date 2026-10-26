import '../../../src/quill.js';
import { describe, expect, test } from 'vitest';
import UINode, {
  TTL_FOR_VALID_SELECTION_CHANGE,
} from '../../../src/modules/uiNode.js';
import Quill, { Delta } from '../../../src/core.js';

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

describe('uiNode in shadow DOM', () => {
  test('moves the caret after the ui node', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const container = document.createElement('div');
    host.attachShadow({ mode: 'open' }).appendChild(container);
    const quill = new Quill(container);
    quill.setContents(
      new Delta().insert('item 1').insert('\n', { list: 'bullet' }),
    );
    new UINode(quill, {});

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', metaKey: true }),
    );
    const li = quill.root.querySelector('li')!;
    quill.domRoot.setNativeRange(li, 0);
    // Browsers canonicalize the caret before firing selectionchange
    // asynchronously, so dispatch it while the caret is still before the UI node.
    document.dispatchEvent(new Event('selectionchange'));

    // The caret is no longer before the UI node. Engines may canonicalize
    // <li>[CARET]item into <li>item[CARET], so compare positions.
    const range = quill.domRoot.getNativeRange();
    expect(range?.comparePoint(li, 1)).toBeLessThanOrEqual(0);
    host.remove();
  });
});
