import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  createDOMRoot,
  DocumentRoot,
  ShadowDOMRoot,
} from '../../../src/core/dom-root.js';
import { createShadowContainer } from '../__helpers__/shadow.js';

// Overrides a (possibly missing) browser API on a single object.
const stubs: (() => void)[] = [];
const stub = (target: object, key: string, value: unknown) => {
  Object.defineProperty(target, key, { value, configurable: true });
  stubs.push(() => {
    delete (target as Record<string, unknown>)[key];
  });
};

afterEach(() => {
  stubs.splice(0).forEach((restore) => restore());
  vi.restoreAllMocks();
});

const createTextInShadowRoot = (text = 'hello world') => {
  const { shadowRoot, container } = createShadowContainer();
  const textNode = document.createTextNode(text);
  container.appendChild(textNode);
  return { shadowRoot, container, textNode };
};

describe('createDOMRoot', () => {
  test('document', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const domRoot = createDOMRoot(container);
    expect(domRoot).toBeInstanceOf(DocumentRoot);
    expect(domRoot.getRoot()).toBe(document);
    expect(domRoot.isInShadowDOM()).toBe(false);
  });

  test('detached element', () => {
    const domRoot = createDOMRoot(document.createElement('div'));
    expect(domRoot).toBeInstanceOf(DocumentRoot);
    expect(domRoot.getRoot()).toBe(document);
  });

  test('open shadow root', () => {
    const { shadowRoot, container } = createShadowContainer();
    const domRoot = createDOMRoot(container);
    expect(domRoot).toBeInstanceOf(ShadowDOMRoot);
    expect(domRoot.getRoot()).toBe(shadowRoot);
    expect(domRoot.isInShadowDOM()).toBe(true);
  });

  test('closed shadow root', () => {
    const { shadowRoot, container } = createShadowContainer('closed');
    expect(createDOMRoot(container).getRoot()).toBe(shadowRoot);
  });

  test('nested shadow root resolves to the innermost root', () => {
    const outer = createShadowContainer();
    const inner = createShadowContainer('open', outer.container);
    expect(createDOMRoot(inner.container).getRoot()).toBe(inner.shadowRoot);
  });
});

describe('querySelector', () => {
  test('is scoped to the root', () => {
    const light = document.body.appendChild(document.createElement('div'));
    light.classList.add('target');
    const { container } = createShadowContainer();
    const shadowTarget = container.appendChild(document.createElement('div'));
    shadowTarget.classList.add('target');

    expect(createDOMRoot(container).querySelector('.target')).toBe(
      shadowTarget,
    );
    expect(createDOMRoot(light).querySelectorAll('.target')).toHaveLength(1);
  });
});

describe('getActiveElement', () => {
  test('returns the focused element inside the shadow root', () => {
    const { host, container } = createShadowContainer();
    const input = container.appendChild(document.createElement('input'));
    input.focus();

    expect(document.activeElement).toBe(host);
    expect(createDOMRoot(container).getActiveElement()).toBe(input);
  });

  test('traverses nested shadow roots', () => {
    const outer = createShadowContainer();
    const inner = createShadowContainer('open', outer.container);
    const input = inner.container.appendChild(document.createElement('input'));
    input.focus();

    expect(createDOMRoot(outer.container).getActiveElement()).toBe(input);
  });
});

describe('ShadowDOMRoot selection', () => {
  test('round trips a native range', () => {
    const { container, textNode } = createTextInShadowRoot();
    const domRoot = createDOMRoot(container);

    domRoot.setNativeRange(textNode, 1, textNode, 3);
    const range = domRoot.getNativeRange();

    expect(range?.startContainer).toBe(textNode);
    expect(range?.startOffset).toBe(1);
    expect(range?.endContainer).toBe(textNode);
    expect(range?.endOffset).toBe(3);
  });

  test('sets the range with setBaseAndExtent on the document selection', () => {
    const { container, textNode } = createTextInShadowRoot();
    const setBaseAndExtent = vi.spyOn(
      document.getSelection()!,
      'setBaseAndExtent',
    );

    createDOMRoot(container).setNativeRange(textNode, 2);

    expect(setBaseAndExtent).toHaveBeenCalledWith(textNode, 2, textNode, 2);
  });

  test('reads the range with getComposedRanges when supported', () => {
    const { shadowRoot, container, textNode } = createTextInShadowRoot();
    const getComposedRanges = vi.fn(() => [
      new StaticRange({
        startContainer: textNode,
        startOffset: 1,
        endContainer: textNode,
        endOffset: 4,
      }),
    ]);
    stub(document.getSelection()!, 'getComposedRanges', getComposedRanges);

    const range = createDOMRoot(container).getNativeRange();

    expect(getComposedRanges).toHaveBeenCalledWith({
      shadowRoots: [shadowRoot],
    });
    expect(range).toBeInstanceOf(Range);
    expect([range?.startOffset, range?.endOffset]).toEqual([1, 4]);
  });

  test('falls back to the variadic getComposedRanges signature', () => {
    const { shadowRoot, container, textNode } = createTextInShadowRoot();
    const getComposedRanges = vi.fn((arg: unknown) => {
      if (arg !== shadowRoot) throw new TypeError();
      return [
        new StaticRange({
          startContainer: textNode,
          startOffset: 2,
          endContainer: textNode,
          endOffset: 2,
        }),
      ];
    });
    stub(document.getSelection()!, 'getComposedRanges', getComposedRanges);

    const range = createDOMRoot(container).getNativeRange();

    expect(getComposedRanges).toHaveBeenCalledTimes(2);
    expect(getComposedRanges).toHaveBeenLastCalledWith(shadowRoot);
    expect(range?.startOffset).toBe(2);
  });

  test('ignores composed ranges with out of bounds offsets', () => {
    const { container, textNode } = createTextInShadowRoot('short');
    stub(document.getSelection()!, 'getComposedRanges', () => [
      new StaticRange({
        startContainer: textNode,
        startOffset: 0,
        endContainer: textNode,
        endOffset: 9,
      }),
    ]);

    expect(createDOMRoot(container).getNativeRange()).toBeNull();
  });

  test('uses ShadowRoot#getSelection without getComposedRanges', () => {
    const { shadowRoot, container, textNode } = createTextInShadowRoot();
    const range = document.createRange();
    range.setStart(textNode, 3);
    stub(document.getSelection()!, 'getComposedRanges', undefined);
    stub(shadowRoot, 'getSelection', () => ({
      rangeCount: 1,
      getRangeAt: () => range,
    }));

    expect(createDOMRoot(container).getNativeRange()).toBe(range);
  });
});

describe('ShadowDOMRoot getRangeFromPoint', () => {
  test('passes the shadow root to caretPositionFromPoint', () => {
    const { shadowRoot, container, textNode } = createTextInShadowRoot();
    const caretPositionFromPoint = vi.fn(() => ({
      offsetNode: textNode,
      offset: 4,
    }));
    stub(document, 'caretPositionFromPoint', caretPositionFromPoint);

    const range = createDOMRoot(container).getRangeFromPoint(10, 20);

    expect(caretPositionFromPoint).toHaveBeenCalledWith(10, 20, {
      shadowRoots: [shadowRoot],
    });
    expect(range?.collapsed).toBe(true);
    expect(range?.startContainer).toBe(textNode);
    expect(range?.startOffset).toBe(4);
  });
});
