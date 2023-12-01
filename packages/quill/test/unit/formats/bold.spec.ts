import { describe, expect, test } from 'vitest';
import {
  createRegistry,
  createScroll as baseCreateScroll,
} from '../__helpers__/factory';
import Bold from '../../../src/formats/bold';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Bold]));

describe('Bold', () => {
  test('optimize and merge', () => {
    const scroll = createScroll('<p><strong>a</strong>b<strong>c</strong></p>');
    const bold = document.createElement('b');
    bold.appendChild(scroll.domNode.firstChild?.childNodes[1] as Node);
    scroll.domNode.firstChild?.insertBefore(
      bold,
      scroll.domNode.firstChild.lastChild,
    );
    scroll.update();
    expect(scroll.domNode).toEqualHTML('<p><strong>abc</strong></p>');
  });
});
