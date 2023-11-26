import { describe, expect, test, vitest } from 'vitest';
import Emitter from '../../../src/core/emitter';
import Selection, { Range } from '../../../src/core/selection';
import Cursor from '../../../src/blots/cursor';
import Scroll from '../../../src/blots/scroll';
import Delta from 'quill-delta';
import { createRegistry } from '../__helpers__/factory';
import { normalizeHTML, sleep } from '../__helpers__/utils';
import Underline from '../../../src/formats/underline';
import Strike from '../../../src/formats/strike';

const createScroll = (html: string) => {
  const emitter = new Emitter();
  const registry = createRegistry([Underline, Strike]);
  const container = document.body.appendChild(document.createElement('div'));
  container.innerHTML = normalizeHTML(html);
  return new Scroll(registry, container, { emitter });
};

describe('Scroll', () => {
  test('initialize empty document', () => {
    const scroll = createScroll('');
    expect(scroll.domNode).toEqualHTML('<p><br></p>');
  });

  test('api change', () => {
    const scroll = createScroll('<p>Hello World!</p>');
    vitest.spyOn(scroll.emitter, 'emit');
    scroll.insertAt(5, '!');
    expect(scroll.emitter.emit).toHaveBeenCalledWith(
      Emitter.events.SCROLL_OPTIMIZE,
      expect.any(Array),
      expect.any(Object),
    );
  });

  test('user change', async () => {
    const scroll = createScroll('<p>Hello World!</p>');
    vitest.spyOn(scroll.emitter, 'emit');
    scroll.domNode.firstChild?.appendChild(document.createTextNode('!'));
    await sleep(1);
    expect(scroll.emitter.emit).toHaveBeenCalledWith(
      Emitter.events.SCROLL_OPTIMIZE,
      expect.any(Array),
      expect.any(Object),
    );
    expect(scroll.emitter.emit).toHaveBeenCalledWith(
      Emitter.events.SCROLL_UPDATE,
      Emitter.sources.USER,
      expect.any(Array),
    );
  });

  test('prevent dragstart', () => {
    const scroll = createScroll('<p>Hello World!</p>');
    const dragstart = new Event('dragstart');
    vitest.spyOn(dragstart, 'preventDefault');
    scroll.domNode.dispatchEvent(dragstart);
    expect(dragstart.preventDefault).toHaveBeenCalled();
  });

  describe('leaf()', () => {
    test('text', () => {
      const scroll = createScroll('<p>Tests</p>');
      const [leaf, offset] = scroll.leaf(2);
      expect(leaf?.value()).toEqual('Tests');
      expect(offset).toEqual(2);
    });

    test('precise', () => {
      const scroll = createScroll(
        '<p><u>0</u><s>1</s><u>2</u><s>3</s><u>4</u></p>',
      );
      const [leaf, offset] = scroll.leaf(3);
      expect(leaf?.value()).toEqual('2');
      expect(offset).toEqual(1);
    });

    test('newline', () => {
      const scroll = createScroll('<p>0123</p><p>5678</p>');
      const [leaf, offset] = scroll.leaf(4);
      expect(leaf?.value()).toEqual('0123');
      expect(offset).toEqual(4);
    });

    test('cursor', () => {
      const scroll = createScroll('<p><u>0</u>1<u>2</u></p>');
      const selection = new Selection(scroll, scroll.emitter);
      selection.setRange(new Range(2));
      selection.format('strike', true);
      const [leaf, offset] = selection.scroll.leaf(2);
      expect(leaf instanceof Cursor).toBe(true);
      expect(offset).toEqual(0);
    });

    test('beyond document', () => {
      const scroll = createScroll('<p>Test</p>');
      const [leaf, offset] = scroll.leaf(10);
      expect(leaf).toEqual(null);
      expect(offset).toEqual(-1);
    });
  });

  describe('insertContents()', () => {
    test('does not mutate the input', () => {
      const scroll = createScroll('<p>Test</p>');
      const delta = new Delta().insert('\n');
      const clonedDelta = new Delta(structuredClone(delta.ops));
      scroll.insertContents(0, delta);
      expect(delta.ops).toEqual(clonedDelta.ops);
    });
  });
});
