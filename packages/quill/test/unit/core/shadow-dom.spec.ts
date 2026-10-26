import { afterEach, describe, expect, test, vi } from 'vitest';
import Quill from '../../../src/core.js';
import { createShadowContainer } from '../__helpers__/shadow.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const createShadowQuill = (mode: ShadowRootMode = 'open') => {
  const { host, shadowRoot, container } = createShadowContainer(mode);
  const quill = new Quill(container);
  quill.setText('hello world\n');
  return { host, shadowRoot, quill };
};

const mouseEvent = (type: string) =>
  new MouseEvent(type, { bubbles: true, composed: true });

describe('Quill in shadow DOM', () => {
  test('detects the shadow root', () => {
    const { shadowRoot, quill } = createShadowQuill();
    expect(quill.domRoot.getRoot()).toBe(shadowRoot);
  });

  test('setSelection() places the native selection in the shadow root', () => {
    const { shadowRoot, quill } = createShadowQuill();

    quill.setSelection(2, 3);

    expect(quill.getSelection()).toEqual({ index: 2, length: 3 });
    const native = quill.domRoot.getNativeRange();
    expect(shadowRoot.contains(native!.startContainer)).toBe(true);
    expect([native?.startOffset, native?.endOffset]).toEqual([2, 5]);
  });

  test('hasFocus() looks inside the shadow root', () => {
    const { host, quill } = createShadowQuill();

    quill.focus();
    expect(document.activeElement).toBe(host);
    expect(quill.hasFocus()).toBe(true);

    quill.blur();
    expect(quill.hasFocus()).toBe(false);
  });

  test('emits selection-change when the native caret moves', async () => {
    const { quill } = createShadowQuill();
    quill.focus();
    // Let Quill finish the silent selection updates caused by the setup.
    await new Promise((resolve) => setTimeout(resolve, 10));
    const handler = vi.fn();
    quill.on(Quill.events.SELECTION_CHANGE, handler);

    const text = quill.root.querySelector('p')!.firstChild!;
    document.getSelection()!.setBaseAndExtent(text, 3, text, 3);

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith(
        { index: 3, length: 0 },
        expect.anything(),
        Quill.sources.USER,
      );
    });
  });

  test('a mouseup outside the shadow host ends a drag', () => {
    const { quill } = createShadowQuill();

    quill.root.dispatchEvent(mouseEvent('mousedown'));
    expect(quill.selection.mouseDown).toBe(true);

    document.body.dispatchEvent(mouseEvent('mouseup'));
    expect(quill.selection.mouseDown).toBe(false);
  });
});

describe('DOM event dispatch', () => {
  const setup = (mode: ShadowRootMode) => {
    const lightContainer = document.body.appendChild(
      document.createElement('div'),
    );
    const lightQuill = new Quill(lightContainer);
    const { quill: shadowQuill } = createShadowQuill(mode);
    return {
      lightQuill,
      shadowQuill,
      light: vi.spyOn(lightQuill.emitter, 'handleDOM'),
      shadow: vi.spyOn(shadowQuill.emitter, 'handleDOM'),
    };
  };

  describe.each(['open', 'closed'] as const)('%s shadow root', (mode) => {
    test.each(['mousedown', 'mouseup', 'click'])(
      'dispatches %s exactly once to every editor',
      (type) => {
        const { lightQuill, shadowQuill, light, shadow } = setup(mode);
        const targets = [shadowQuill.root, document.body, lightQuill.root];
        targets.forEach((target) => {
          light.mockClear();
          shadow.mockClear();
          target.dispatchEvent(mouseEvent(type));
          expect(light).toHaveBeenCalledTimes(1);
          expect(shadow).toHaveBeenCalledTimes(1);
        });
      },
    );

    test('dispatches selectionchange to editors in the shadow root', () => {
      const { light, shadow } = setup(mode);

      document.dispatchEvent(new Event('selectionchange'));

      expect(light).toHaveBeenCalledTimes(1);
      expect(shadow).toHaveBeenCalledTimes(1);
    });
  });

  test('resolves the original target for listeners', () => {
    const { quill } = createShadowQuill();
    const handler = vi.fn();
    quill.emitter.listenDOM('click', quill.root, handler);

    quill.root.dispatchEvent(mouseEvent('click'));
    document.body.dispatchEvent(mouseEvent('click'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('nested shadow roots', () => {
    const outer = createShadowContainer();
    const inner = createShadowContainer('open', outer.container);
    const quill = new Quill(inner.container);
    const spy = vi.spyOn(quill.emitter, 'handleDOM');

    quill.root.dispatchEvent(mouseEvent('click'));
    outer.container.dispatchEvent(mouseEvent('click'));
    document.body.dispatchEvent(mouseEvent('click'));

    expect(spy).toHaveBeenCalledTimes(3);
  });
});
