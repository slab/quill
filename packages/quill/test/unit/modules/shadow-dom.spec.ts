import { afterEach, describe, expect, test, vi } from 'vitest';
import Quill, { Delta } from '../../../src/quill.js';
import type Toolbar from '../../../src/modules/toolbar.js';
import { createShadowContainer } from '../__helpers__/shadow.js';

const isMac = /Mac/i.test(navigator.platform);

afterEach(() => {
  delete (document as { caretPositionFromPoint?: unknown })
    .caretPositionFromPoint;
});

describe('modules in shadow DOM', () => {
  test('toolbar resolves a selector inside the shadow root', () => {
    const { container } = createShadowContainer();
    const toolbar = document.createElement('div');
    toolbar.id = 'toolbar';
    toolbar.innerHTML = '<button class="ql-bold"></button>';
    container.before(toolbar);
    const quill = new Quill(container, { modules: { toolbar: '#toolbar' } });
    quill.setText('hello\n');
    quill.setSelection(0, 5);

    toolbar.querySelector('button')!.click();

    expect((quill.getModule('toolbar') as Toolbar).container).toBe(toolbar);
    expect(quill.getContents()).toEqual(
      new Delta().insert('hello', { bold: true }).insert('\n'),
    );
  });

  test('keyboard shortcuts work when focus is inside the shadow root', () => {
    const { container } = createShadowContainer();
    const quill = new Quill(container);
    quill.setText('hello\n');
    quill.setSelection(0, 5);

    quill.root.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'b',
        [isMac ? 'metaKey' : 'ctrlKey']: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(quill.getContents()).toEqual(
      new Delta().insert('hello', { bold: true }).insert('\n'),
    );
  });

  test('uploader uploads at the drop position inside the shadow root', () => {
    const { container } = createShadowContainer();
    const handler = vi.fn();
    const quill = new Quill(container, { modules: { uploader: { handler } } });
    quill.setText('hello\n');
    const text = quill.root.querySelector('p')!.firstChild!;
    Object.defineProperty(document, 'caretPositionFromPoint', {
      value: () => ({ offsetNode: text, offset: 2 }),
      configurable: true,
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File(['x'], 'a.png', { type: 'image/png' }));

    quill.root.dispatchEvent(
      new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }),
    );

    expect(handler).toHaveBeenCalledWith({ index: 2, length: 0 }, [
      expect.any(File),
    ]);
  });
});
