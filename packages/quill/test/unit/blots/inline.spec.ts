import { describe, expect, test } from 'vitest';
import { createRegistry, createScroll } from '../__helpers__/factory';
import Bold from '../../../src/formats/bold';
import Italic from '../../../src/formats/italic';

describe('Inline', () => {
  test('format order', () => {
    const scroll = createScroll(
      '<p>Hello World!</p>',
      createRegistry([Bold, Italic]),
    );
    scroll.formatAt(0, 1, 'bold', true);
    scroll.formatAt(0, 1, 'italic', true);
    scroll.formatAt(2, 1, 'italic', true);
    scroll.formatAt(2, 1, 'bold', true);
    expect(scroll.domNode).toEqualHTML(
      '<p><strong><em>H</em></strong>e<strong><em>l</em></strong>lo World!</p>',
    );
  });

  test('reorder', () => {
    const scroll = createScroll(
      '<p>0<strong>12</strong>3</p>',
      createRegistry([Bold, Italic]),
    );
    const p = scroll.domNode.firstChild as HTMLParagraphElement;
    const em = document.createElement('em');
    Array.from(p.childNodes).forEach(function (node) {
      em.appendChild(node);
    });
    p.appendChild(em);
    expect(scroll.domNode).toEqualHTML('<p><em>0<strong>12</strong>3</em></p>');
    scroll.update();
    expect(scroll.domNode).toEqualHTML(
      '<p><em>0</em><strong><em>12</em></strong><em>3</em></p>',
    );
  });
});
