import Editor from '../../../src/core/editor';
import Script from '../../../src/formats/script';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import { describe, expect, test } from 'vitest';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Script]));

describe('Script', () => {
  test('add', () => {
    const editor = new Editor(
      createScroll('<p>a<sup>2</sup> + b2 = c<sup>2</sup></p>'),
    );
    editor.formatText(6, 1, { script: 'super' });
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></p>',
    );
  });

  test('remove', () => {
    const editor = new Editor(
      createScroll('<p>a<sup>2</sup> + b<sup>2</sup></p>'),
    );
    editor.formatText(1, 1, { script: false });
    expect(editor.scroll.domNode).toEqualHTML('<p>a2 + b<sup>2</sup></p>');
  });

  test('replace', () => {
    const editor = new Editor(
      createScroll('<p>a<sup>2</sup> + b<sup>2</sup></p>'),
    );
    editor.formatText(1, 1, { script: 'sub' });
    expect(editor.scroll.domNode).toEqualHTML(
      '<p>a<sub>2</sub> + b<sup>2</sup></p>',
    );
  });
});
