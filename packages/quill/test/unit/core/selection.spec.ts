import Selection, { Range } from '../../../src/core/selection';
import Cursor from '../../../src/blots/cursor';
import Emitter from '../../../src/core/emitter';
import { expect, describe, test } from 'vitest';
import { createRegistry, createScroll } from '../__helpers__/factory';
import Bold from '../../../src/formats/bold';
import Underline from '../../../src/formats/underline';
import Image from '../../../src/formats/image';
import Link from '../../../src/formats/link';
import Italic from '../../../src/formats/italic';
import Strike from '../../../src/formats/strike';
import { ColorStyle } from '../../../src/formats/color';
import { BackgroundStyle } from '../../../src/formats/background';
import { FontClass } from '../../../src/formats/font';

const createSelection = (html: string, container = document.body) => {
  const scroll = createScroll(
    html,
    createRegistry([
      Bold,
      Underline,
      Italic,
      Strike,
      Image,
      Link,
      ColorStyle,
      BackgroundStyle,
      FontClass,
    ]),
    container,
  );
  return new Selection(scroll, scroll.emitter);
};

describe('Selection', () => {
  describe('focus()', () => {
    const setupTest = () => {
      const container = document.createElement('div');
      const textarea = container.appendChild(
        document.createElement('textarea'),
      );
      const selection = createSelection('<p>0123</p>', container);

      document.body.appendChild(container);
      textarea.focus();
      textarea.select();
      return { selection, textarea };
    };

    test('initial focus', () => {
      const { selection } = setupTest();
      expect(selection.hasFocus()).toBe(false);
      selection.focus();
      expect(selection.hasFocus()).toBe(true);
    });

    test('restore last range', () => {
      const { selection, textarea } = setupTest();
      const range = new Range(1, 2);
      selection.setRange(range);
      textarea.focus();
      textarea.select();
      expect(selection.hasFocus()).toBe(false);
      selection.focus();
      expect(selection.hasFocus()).toBe(true);
      expect(selection.getRange()[0]).toEqual(range);
    });
  });

  describe('getRange()', () => {
    test('empty document', () => {
      const selection = createSelection('');
      selection.setNativeRange(selection.root.querySelector('br'), 0);
      const [range] = selection.getRange();
      expect(range?.index).toEqual(0);
      expect(range?.length).toEqual(0);
    });

    test('empty line', () => {
      const selection = createSelection('<p>0</p><p><br></p><p>3</p>');
      selection.setNativeRange(selection.root.querySelector('br'), 0);
      const [range] = selection.getRange();
      expect(range?.index).toEqual(2);
      expect(range?.length).toEqual(0);
    });

    test('end of line', () => {
      const selection = createSelection('<p>0</p>');
      selection.setNativeRange(
        selection.root.firstChild?.firstChild as Node,
        1,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(1);
      expect(range?.length).toEqual(0);
    });

    test('text node', () => {
      const selection = createSelection('<p>0123</p>');
      selection.setNativeRange(
        selection.root.firstChild?.firstChild as Node,
        1,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(1);
      expect(range?.length).toEqual(0);
    });

    test('line boundaries', () => {
      const selection = createSelection('<p><br></p><p>12</p>');
      selection.setNativeRange(
        selection.root.firstChild,
        0,
        selection.root.lastChild?.lastChild as Node,
        2,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(0);
      expect(range?.length).toEqual(3);
    });

    test('nested text node', () => {
      const selection = createSelection(
        `<p><strong><em>01</em></strong></p>
        <ol>
          <li data-list="bullet"><em><u>34</u></em></li>
        </ol>`,
      );
      selection.setNativeRange(
        selection.root.querySelector('em')?.firstChild as Node,
        1,
        selection.root.querySelector('u')?.firstChild as Node,
        1,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(1);
      expect(range?.length).toEqual(3);
    });

    test('between embed across lines', () => {
      const selection = createSelection(
        `
        <p>
          <img src="/assets/favicon.png">
          <img src="/assets/favicon.png">
        </p>
        <p>
          <img src="/assets/favicon.png">
          <img src="/assets/favicon.png">
        </p>`,
      );
      selection.setNativeRange(
        selection.root.firstChild,
        1,
        selection.root.lastChild,
        1,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(1);
      expect(range?.length).toEqual(3);
    });

    test('between embed across list', () => {
      const selection = createSelection(
        `
        <p>
          <img src="/assets/favicon.png">
          <img src="/assets/favicon.png">
        </p>
        <ol>
          <li data-list="bullet">
            <img src="/assets/favicon.png">
            <img src="/assets/favicon.png">
          </li>
        </ol>`,
      );
      selection.setNativeRange(
        selection.root.firstChild,
        1,
        selection.root.lastChild?.firstChild,
        2,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(1);
      expect(range?.length).toEqual(3);
    });

    test('between inlines', () => {
      const selection = createSelection('<p><em>01</em><s>23</s><u>45</u></p>');
      selection.setNativeRange(
        selection.root.firstChild,
        1,
        selection.root.firstChild,
        2,
      );
      const [range] = selection.getRange();
      expect(range?.index).toEqual(2);
      expect(range?.length).toEqual(2);
    });

    test('between blocks', () => {
      const selection = createSelection(
        `
        <p>01</p>
        <p><br></p>
        <ol>
          <li data-list="bullet">45</li>
          <li data-list="bullet">78</li>
        </ol>`,
      );
      selection.setNativeRange(selection.root, 1, selection.root.lastChild, 1);
      const [range] = selection.getRange();
      expect(range?.index).toEqual(3);
      expect(range?.length).toEqual(4);
    });

    test('wrong input', () => {
      const container = document.body.appendChild(
        document.createElement('div'),
      );
      const textarea = container.appendChild(
        document.createElement('textarea'),
      );
      const selection = createSelection('<p>0123</p>', container);
      textarea.select();
      const [range] = selection.getRange();
      expect(range).toEqual(null);
    });
  });

  describe('setRange()', () => {
    test('empty document', () => {
      const selection = createSelection('');
      const expected = new Range(0);
      selection.setRange(expected);
      const [range] = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.hasFocus()).toBe(true);
    });

    test('empty lines', () => {
      const selection = createSelection(
        `
        <p><br></p>
        <ol>
          <li data-list="bullet"><br></li>
        </ol>`,
      );
      const expected = new Range(0, 1);
      selection.setRange(expected);
      const [range] = selection.getRange();
      expect(range).toEqual(range);
      expect(selection.hasFocus()).toBe(true);
    });

    test('nested text node', () => {
      const selection = createSelection(
        `
        <p><strong><em>01</em></strong></p>
        <ol>
          <li data-list="bullet"><em><u>34</u></em></li>
        </ol>`,
      );
      const expected = new Range(1, 3);
      selection.setRange(expected);
      const [range] = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.hasFocus()).toBe(true);
    });

    test('between inlines', () => {
      const selection = createSelection('<p><em>01</em><s>23</s><u>45</u></p>');
      const expected = new Range(2, 2);
      selection.setRange(expected);
      const [range] = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.hasFocus()).toBe(true);
    });

    test('single embed', () => {
      const selection = createSelection(
        `<p><img src="/assets/favicon.png"></p>`,
      );
      const expected = new Range(1, 0);
      selection.setRange(expected);
      const [range] = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.hasFocus()).toBe(true);
    });

    test('between embeds', () => {
      const selection = createSelection(
        `
        <p>
          <img src="/assets/favicon.png">
          <img src="/assets/favicon.png">
        </p>
        <ol>
          <li data-list="bullet">
            <img src="/assets/favicon.png">
            <img src="/assets/favicon.png">
          </li>
        </ol>`,
      );
      const expected = new Range(1, 3);
      selection.setRange(expected);
      const [range] = selection.getRange();
      expect(range).toEqual(expected);
      expect(selection.hasFocus()).toBe(true);
    });

    test('null', () => {
      const selection = createSelection('<p>0123</p>');
      selection.setRange(new Range(1));
      let [range] = selection.getRange();
      expect(range).not.toEqual(null);
      selection.setRange(null);
      [range] = selection.getRange();
      expect(range).toEqual(null);
      expect(selection.hasFocus()).toBe(false);
    });

    test('after format', async () => {
      const selection = createSelection('<p>0123 567 9012</p>');
      selection.setRange(new Range(5));
      selection.format('bold', true);
      selection.format('bold', false);
      selection.setRange(new Range(8));

      await new Promise<void>((resolve) => {
        selection.emitter.once(Emitter.events.SCROLL_OPTIMIZE, () => {
          resolve();
        });
      });
      const [range] = selection.getRange();
      expect(range?.index).toEqual(8);
    });
  });

  describe('format()', () => {
    test('trailing', () => {
      const selection = createSelection(`<p>0123</p>`);
      selection.setRange(new Range(4));
      selection.format('bold', true);
      expect(selection.getRange()[0]?.index).toEqual(4);
      expect(selection.root).toEqualHTML(`
        <p>0123<strong><span class="ql-cursor">${Cursor.CONTENTS}</span></strong></p>
      `);
    });

    test('split nodes', () => {
      const selection = createSelection(`<p><em>0123</em></p>`);
      selection.setRange(new Range(2));

      selection.format('bold', true);
      expect(selection.getRange()[0]?.index).toEqual(2);
      expect(selection.root).toEqualHTML(`
      <p><em>01</em><strong><em><span class="ql-cursor">${Cursor.CONTENTS}</span></em></strong><em>23</em></p>
      `);
    });

    test('between characters', () => {
      const selection = createSelection(`<p><em>0</em><strong>1</strong></p>`);
      selection.setRange(new Range(1));
      selection.format('underline', true);
      expect(selection.getRange()[0]?.index).toEqual(1);
      expect(selection.root).toEqualHTML(`
        <p><em>0<u><span class="ql-cursor">${Cursor.CONTENTS}</span></u></em><strong>1</strong></p>
      `);
    });

    test('empty line', () => {
      const selection = createSelection(`<p><br></p>`);
      selection.setRange(new Range(0));
      selection.format('bold', true);
      expect(selection.getRange()[0]?.index).toEqual(0);
      expect(selection.root).toEqualHTML(`
        <p><strong><span class="ql-cursor">${Cursor.CONTENTS}</span></strong></p>
      `);
    });

    test('cursor interference', () => {
      const selection = createSelection(`<p>0123</p>`);
      selection.setRange(new Range(2));
      selection.format('underline', true);
      selection.scroll.update();
      const native = selection.getNativeRange();
      expect(native?.start.node).toEqual(selection.cursor.textNode);
    });

    test('multiple', () => {
      const selection = createSelection(`<p>0123</p>`);
      selection.setRange(new Range(2));
      selection.format('color', 'red');
      selection.format('italic', true);
      selection.format('underline', true);
      selection.format('background', 'blue');
      expect(selection.getRange()[0]?.index).toEqual(2);
      expect(selection.root).toEqualHTML(`
        <p>01<em style="color: red; background-color: blue;"><u><span class="ql-cursor">${Cursor.CONTENTS}</span></u></em>23</p>
      `);
    });

    test('remove format', () => {
      const selection = createSelection(`<p><strong>0123</strong></p>`);
      selection.setRange(new Range(2));
      selection.format('italic', true);
      selection.format('underline', true);
      selection.format('italic', false);
      expect(selection.getRange()[0]?.index).toEqual(2);
      expect(selection.root).toEqualHTML(`
        <p><strong>01<u><span class="ql-cursor">${Cursor.CONTENTS}</span></u>23</strong></p>
      `);
    });

    test('selection change cleanup', () => {
      const selection = createSelection(`<p>0123</p>`);
      selection.setRange(new Range(2));
      selection.format('italic', true);
      selection.setRange(new Range(0, 0));
      selection.scroll.update();
      expect(selection.root).toEqualHTML('<p>0123</p>');
    });

    test('text change cleanup', () => {
      const selection = createSelection(`<p>0123</p>`);
      selection.setRange(new Range(2));
      selection.format('italic', true);
      selection.cursor.textNode.data = `${Cursor.CONTENTS}|`;
      selection.setNativeRange(selection.cursor.textNode, 2);
      selection.scroll.update();
      expect(selection.root).toEqualHTML('<p>01<em>|</em>23</p>');
    });

    test('no cleanup', () => {
      const selection = createSelection('<p>0123</p><p><br></p>');
      selection.setRange(new Range(2));
      selection.format('italic', true);
      selection.root.removeChild(selection.root.lastChild as Node);
      selection.scroll.update();
      expect(selection.getRange()[0]?.index).toEqual(2);
      expect(selection.root).toEqualHTML(`
        <p>01<em><span class="ql-cursor">${Cursor.CONTENTS}</span></em>23</p>
      `);
    });

    describe('unlink cursor', () => {
      test('one level', () => {
        const selection = createSelection(
          '<p><strong><a href="https://example.com">link</a></strong></p><p><br></p>',
        );
        selection.setRange(new Range(4));
        selection.format('bold', false);
        expect(selection.root).toEqualHTML(`
          <p><strong><a href="https://example.com">link</a></strong><span class="ql-cursor">${Cursor.CONTENTS}</span></p>
          <p><br /></p>
        `);
      });

      test('nested formats', () => {
        const selection = createSelection(
          '<p><strong><em><a href="https://example.com">bold</a></em></strong></p><p><br></p>',
        );
        selection.setRange(new Range(4));
        selection.format('italic', false);
        expect(selection.root).toEqualHTML(`
          <p><strong><em><a href="https://example.com">bold</a></em><span class="ql-cursor">${Cursor.CONTENTS}</span></strong></p>
          <p><br /></p>
        `);
      });

      test('ignore link format', () => {
        const selection = createSelection(
          '<p><strong>bold</strong></p><p><br></p>',
        );
        selection.setRange(new Range(4));
        selection.format('link', 'https://example.com');
        expect(selection.root).toEqualHTML(`
          <p><strong>bold<span class="ql-cursor">${Cursor.CONTENTS}</span></strong></p>
          <p><br /></p>
        `);
      });
    });
  });

  describe('getBounds()', () => {
    const setup = () => {
      const container = document.body.appendChild(
        document.createElement('div'),
      );
      container.classList.add('ql-editor');
      const style = document.body.appendChild(document.createElement('style'));
      style.innerText =
        '.ql-editor p, .ql-editor img { margin: 0; padding: 0; border: 0; }';
      container.style.fontFamily = 'monospace';
      container.style.lineHeight = '18px';
      const div = container.appendChild(document.createElement('div'));
      div.style.border = '1px solid #777';
      div.innerHTML = '<p><span>0</span></p>';
      const span = div.firstChild?.firstChild as HTMLSpanElement;
      const bounds = span.getBoundingClientRect();
      const reference = {
        height: bounds.height,
        left: bounds.left,
        lineHeight: span.parentElement?.offsetHeight as number,
        width: bounds.width,
        top: bounds.top,
      };
      div.remove();

      return { reference, container };
    };

    test('empty document', () => {
      const { reference, container } = setup();
      const selection = createSelection('<p><br></p>', container);
      const bounds = selection.getBounds(0);
      expect(bounds?.left).approximately(reference.left, 3);
      expect(bounds?.height).approximately(reference.height, 3);
      expect(bounds?.top).approximately(reference.top, 3);
    });

    test('empty line', () => {
      const { reference, container } = setup();
      const selection = createSelection(
        `
        <p>0000</p>
        <p><br></p>
        <p>0000</p>`,
        container,
      );
      const bounds = selection.getBounds(5);
      expect(bounds?.left).approximately(reference.left, 3);
      expect(bounds?.height).approximately(reference.height, 3);
      expect(bounds?.top).approximately(
        reference.top + reference.lineHeight,
        3,
      );
    });

    test('plain text', () => {
      const { reference, container } = setup();
      const selection = createSelection('<p>0123</p>', container);
      const bounds = selection.getBounds(2);
      expect(bounds?.left).approximately(
        reference.left + reference.width * 2,
        2,
      );
      expect(bounds?.height).approximately(reference.height, 1);
      expect(bounds?.top).approximately(reference.top, 1);
    });

    test('multiple characters', () => {
      const { reference, container } = setup();
      const selection = createSelection('<p>0123</p>', container);
      const bounds = selection.getBounds(1, 2);
      expect(bounds?.left).approximately(reference.left + reference.width, 2);
      expect(bounds?.height).approximately(reference.height, 1);
      expect(bounds?.top).approximately(reference.top, 1);
      expect(bounds?.width).approximately(reference.width * 2, 2);
    });

    test('start of line', () => {
      const { reference, container } = setup();
      const selection = createSelection(
        `
        <p>0000</p>
        <p>0000</p>`,
        container,
      );
      const bounds = selection.getBounds(5);
      expect(bounds?.left).approximately(reference.left, 1);
      expect(bounds?.height).approximately(reference.height, 1);
      expect(bounds?.top).approximately(
        reference.top + reference.lineHeight,
        1,
      );
    });

    test('end of line', () => {
      const { reference, container } = setup();
      const selection = createSelection(
        `
        <p>0000</p>
        <p>0000</p>
        <p>0000</p>`,
        container,
      );
      const bounds = selection.getBounds(9);
      expect(bounds?.left).approximately(
        reference.left + reference.width * 4,
        4,
      );
      expect(bounds?.height).approximately(reference.height, 1);
      expect(bounds?.top).approximately(
        reference.top + reference.lineHeight,
        1,
      );
    });

    test('multiple lines', () => {
      const { reference, container } = setup();
      const selection = createSelection(
        `
        <p>0000</p>
        <p>0000</p>
        <p>0000</p>`,
        container,
      );
      const bounds = selection.getBounds(2, 4);
      expect(bounds?.left).approximately(reference.left, 1);
      expect(bounds?.height).approximately(reference.height * 2, 3);
      expect(bounds?.top).approximately(reference.top, 1);
      expect(bounds?.width).toBeGreaterThan(3 * reference.width);
    });

    test('large text', () => {
      const { reference, container } = setup();
      const selection = createSelection(
        '<p><span class="ql-size-large">0000</span></p>',
        container,
      );
      const span = container.querySelector('span') as HTMLSpanElement;
      const bounds = selection.getBounds(2);
      expect(bounds?.left).approximately(
        reference.left + span.offsetWidth / 2,
        3,
      );
      expect(bounds?.height).approximately(span.offsetHeight, 3);
      expect(bounds?.top).approximately(reference.top, 3);
    });

    test('image', () => {
      const { reference, container } = setup();
      const selection = createSelection(
        `
        <p>
          <img src="/assets/favicon.png" width="32px" height="32px">
          <img src="/assets/favicon.png" width="32px" height="32px">
        </p>`,
        container,
      );
      const bounds = selection.getBounds(1);
      expect(bounds?.left).approximately(reference.left + 32, 1);
      expect(bounds?.height).approximately(32, 1);
      expect(bounds?.top).approximately(reference.top, 3);
    });

    test('beyond document', () => {
      const selection = createSelection('<p>0123</p>');
      expect(() => {
        selection.getBounds(10, 0);
      }).not.toThrow();
      expect(() => {
        selection.getBounds(0, 10);
      }).not.toThrow();
    });
  });
});
