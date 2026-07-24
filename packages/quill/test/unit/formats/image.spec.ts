import '../__helpers__/expect.js';

import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';

import Image from '../../../src/formats/image.js';
import { describe, expect, test } from 'vitest';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Image]));

describe('Image', () => {
  test('add with title', () => {
    const scroll = createScroll('<p><img src="https://quilljs.com/images/favicon.png" title="Quill"></p>');
    expect(scroll.domNode).toEqualHTML('<p><img src="https://quilljs.com/images/favicon.png" title="Quill"></p>');
  });

  test('set title', () => {
    const scroll = createScroll('<p><img src="https://quilljs.com/images/favicon.png"></p>');
    const img = scroll.domNode.querySelector('img') as HTMLImageElement;
    img.setAttribute('title', 'Quill');
    expect(scroll.domNode).toEqualHTML('<p><img src="https://quilljs.com/images/favicon.png" title="Quill"></p>');
  });
});