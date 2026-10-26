import { describe, expect, test } from 'vitest';
import Quill from '../../../src/quill.js';
import type BaseTheme from '../../../src/themes/base.js';
import { createShadowContainer } from '../__helpers__/shadow.js';

const createSnowQuill = () => {
  const { host, shadowRoot, container } = createShadowContainer();
  const quill = new Quill(container, {
    theme: 'snow',
    modules: { toolbar: [[{ header: [1, 2, false] }]] },
  });
  const theme = quill.theme as BaseTheme;
  return { host, shadowRoot, quill, theme };
};

describe('themes in shadow DOM', () => {
  test('tooltip is bounded by the shadow host', () => {
    const { host, theme } = createSnowQuill();
    expect(theme.tooltip!.boundsContainer).toBe(host);
  });

  test('tooltip hides on a click outside the shadow host', () => {
    const { quill, theme } = createSnowQuill();
    const tooltip = theme.tooltip!;
    tooltip.show();
    quill.blur();

    tooltip.root.click();
    expect(tooltip.root.classList.contains('ql-hidden')).toBe(false);

    document.body.click();
    expect(tooltip.root.classList.contains('ql-hidden')).toBe(true);
  });

  test('picker closes on a click outside the shadow host', () => {
    const { shadowRoot, theme } = createSnowQuill();
    const [picker] = theme.pickers;
    expect(shadowRoot.contains(picker.container)).toBe(true);

    picker.label.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(picker.container.classList.contains('ql-expanded')).toBe(true);

    document.body.click();
    expect(picker.container.classList.contains('ql-expanded')).toBe(false);
  });
});
