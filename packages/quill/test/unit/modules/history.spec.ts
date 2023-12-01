import Delta from 'quill-delta';
import { describe, expect, test, vitest } from 'vitest';
import Quill from '../../../src/core';
import { getLastChangeIndex } from '../../../src/modules/history';
import type { HistoryOptions } from '../../../src/modules/history';
import { createRegistry, createScroll } from '../__helpers__/factory';
import { sleep } from '../__helpers__/utils';
import Bold from '../../../src/formats/bold';
import Image from '../../../src/formats/image';
import Link from '../../../src/formats/link';
import { AlignClass } from '../../../src/formats/align';

describe('History', () => {
  const scroll = createScroll(
    '',
    createRegistry([Bold, Image, Link, AlignClass]),
  );

  describe('getLastChangeIndex', () => {
    test('delete', () => {
      const delta = new Delta().retain(4).delete(2);
      expect(getLastChangeIndex(scroll, delta)).toEqual(4);
    });

    test('delete with inserts', () => {
      const delta = new Delta().retain(4).insert('test').delete(2);
      expect(getLastChangeIndex(scroll, delta)).toEqual(8);
    });

    test('insert text', () => {
      const delta = new Delta().retain(4).insert('testing');
      expect(getLastChangeIndex(scroll, delta)).toEqual(11);
    });

    test('insert embed', () => {
      const delta = new Delta().retain(4).insert({ image: true });
      expect(getLastChangeIndex(scroll, delta)).toEqual(5);
    });

    test('insert with deletes', () => {
      const delta = new Delta().retain(4).delete(3).insert('!');
      expect(getLastChangeIndex(scroll, delta)).toEqual(5);
    });

    test('format', () => {
      const delta = new Delta().retain(4).retain(3, { bold: true });
      expect(getLastChangeIndex(scroll, delta)).toEqual(7);
    });

    test('format newline', () => {
      const delta = new Delta().retain(4).retain(1, { align: 'left' });
      expect(getLastChangeIndex(scroll, delta)).toEqual(4);
    });

    test('format mixed', () => {
      const delta = new Delta()
        .retain(4)
        .retain(1, { align: 'left', bold: true });
      expect(getLastChangeIndex(scroll, delta)).toEqual(4);
    });

    test('insert newline', () => {
      const delta = new Delta().retain(4).insert('a\n');
      expect(getLastChangeIndex(scroll, delta)).toEqual(5);
    });

    test('mutliple newline inserts', () => {
      const delta = new Delta().retain(4).insert('ab\n\n');
      expect(getLastChangeIndex(scroll, delta)).toEqual(7);
    });
  });

  describe('undo/redo', () => {
    const setup = (options?: Partial<HistoryOptions>) => {
      const container = document.body.appendChild(
        document.createElement('div'),
      );
      container.innerHTML = '<div><p>The lazy fox</p></div>';
      const quill = new Quill(container, {
        modules: {
          history: { delay: 400, ...options },
        },
        registry: scroll.registry,
      });
      return { quill, original: quill.getContents() };
    };

    test('limits undo stack size', () => {
      const { quill } = setup({ delay: 0, maxStack: 2 });
      ['A', 'B', 'C'].forEach((text) => {
        // @ts-expect-error
        quill.insertText(0, text);
      });
      expect(quill.history.stack.undo.length).toEqual(2);
    });

    test('emits selection changes', () => {
      const { quill } = setup({ delay: 0 });
      // @ts-expect-error
      quill.insertText(0, 'foo');
      const change = vitest.fn();
      quill.on('selection-change', change);
      quill.history.undo();

      expect(change).toHaveBeenCalledOnce();
      expect(change).toHaveBeenCalledWith(expect.anything(), null, 'user');
    });

    test('user change', () => {
      const { quill, original } = setup({ delay: 0 });
      (quill.root.firstChild as HTMLElement).innerHTML = 'The lazy foxes';
      quill.update();
      const changed = quill.getContents();
      expect(changed).not.toEqual(original);
      quill.history.undo();
      expect(quill.getContents()).toEqual(original);
      quill.history.redo();
      expect(quill.getContents()).toEqual(changed);
    });

    test('merge changes', () => {
      const { quill, original } = setup();
      expect(quill.history.stack.undo.length).toEqual(0);
      quill.updateContents(new Delta().retain(12).insert('e'));
      expect(quill.history.stack.undo.length).toEqual(1);
      quill.updateContents(new Delta().retain(13).insert('s'));
      expect(quill.history.stack.undo.length).toEqual(1);
      quill.history.undo();
      expect(quill.getContents()).toEqual(original);
      expect(quill.history.stack.undo.length).toEqual(0);
    });

    test('dont merge changes', async () => {
      const { quill } = setup();
      expect(quill.history.stack.undo.length).toEqual(0);
      quill.updateContents(new Delta().retain(12).insert('e'));
      expect(quill.history.stack.undo.length).toEqual(1);
      // @ts-expect-error
      await sleep((quill.history.options.delay as number) * 1.25);
      quill.updateContents(new Delta().retain(13).insert('s'));
      expect(quill.history.stack.undo.length).toEqual(2);
    });

    test('multiple undos', async () => {
      const { quill, original } = setup();
      expect(quill.history.stack.undo.length).toEqual(0);
      quill.updateContents(new Delta().retain(12).insert('e'));
      const contents = quill.getContents();
      // @ts-expect-error
      await sleep((quill.history.options.delay as number) * 1.25);
      quill.updateContents(new Delta().retain(13).insert('s'));
      quill.history.undo();
      expect(quill.getContents()).toEqual(contents);
      quill.history.undo();
      expect(quill.getContents()).toEqual(original);
    });

    test('transform api change', () => {
      const { quill } = setup();
      // @ts-expect-error
      quill.history.options.userOnly = true;
      quill.updateContents(
        new Delta().retain(12).insert('es'),
        Quill.sources.USER,
      );
      quill.history.lastRecorded = 0;
      quill.updateContents(
        new Delta().retain(14).insert('!'),
        Quill.sources.USER,
      );
      quill.history.undo();
      quill.updateContents(new Delta().retain(4).delete(5), Quill.sources.API);
      expect(quill.getContents()).toEqual(new Delta().insert('The foxes\n'));
      quill.history.undo();
      expect(quill.getContents()).toEqual(new Delta().insert('The fox\n'));
      quill.history.redo();
      expect(quill.getContents()).toEqual(new Delta().insert('The foxes\n'));
      quill.history.redo();
      expect(quill.getContents()).toEqual(new Delta().insert('The foxes!\n'));
    });

    test('transform preserve intention', () => {
      const { quill } = setup({ userOnly: true });
      const url = 'https://www.google.com/';
      quill.updateContents(
        new Delta().insert(url, { link: url }),
        Quill.sources.USER,
      );
      quill.history.lastRecorded = 0;
      quill.updateContents(
        new Delta().delete(url.length).insert('Google', { link: url }),
        Quill.sources.API,
      );
      quill.history.lastRecorded = 0;
      quill.updateContents(
        new Delta().retain(quill.getLength() - 1).insert('!'),
        Quill.sources.USER,
      );
      quill.history.lastRecorded = 0;
      expect(quill.getContents()).toEqual(
        new Delta().insert('Google', { link: url }).insert('The lazy fox!\n'),
      );
      quill.history.undo();
      expect(quill.getContents()).toEqual(
        new Delta().insert('Google', { link: url }).insert('The lazy fox\n'),
      );
      quill.history.undo();
      expect(quill.getContents()).toEqual(
        new Delta().insert('Google', { link: url }).insert('The lazy fox\n'),
      );
    });

    test('ignore remote changes', () => {
      const { quill } = setup();
      // @ts-expect-error
      quill.history.options.delay = 0;
      // @ts-expect-error
      quill.history.options.userOnly = true;
      quill.setText('\n');
      quill.insertText(0, 'a', Quill.sources.USER);
      quill.insertText(1, 'b', Quill.sources.API);
      quill.insertText(2, 'c', Quill.sources.USER);
      quill.insertText(3, 'd', Quill.sources.API);
      expect(quill.getText()).toEqual('abcd\n');
      quill.history.undo();
      expect(quill.getText()).toEqual('abd\n');
      quill.history.undo();
      expect(quill.getText()).toEqual('bd\n');
      quill.history.redo();
      expect(quill.getText()).toEqual('abd\n');
      quill.history.redo();
      expect(quill.getText()).toEqual('abcd\n');
    });

    test('correctly transform against remote changes', () => {
      const { quill } = setup({ delay: 0, userOnly: true });
      quill.setText('b\n');
      quill.insertText(1, 'd', Quill.sources.USER);
      quill.insertText(0, 'a', Quill.sources.USER);
      quill.insertText(2, 'c', Quill.sources.API);
      expect(quill.getText()).toEqual('abcd\n');
      quill.history.undo();
      expect(quill.getText()).toEqual('bcd\n');
      quill.history.undo();
      expect(quill.getText()).toEqual('bc\n');
      quill.history.redo();
      expect(quill.getText()).toEqual('bcd\n');
      quill.history.redo();
      expect(quill.getText()).toEqual('abcd\n');
    });

    test('correctly transform against remote changes breaking up an insert', () => {
      const { quill } = setup({ delay: 0, userOnly: true });
      quill.setText('\n');
      quill.insertText(0, 'ABC', Quill.sources.USER);
      quill.insertText(3, '4', Quill.sources.API);
      quill.insertText(2, '3', Quill.sources.API);
      quill.insertText(1, '2', Quill.sources.API);
      quill.insertText(0, '1', Quill.sources.API);
      expect(quill.getText()).toEqual('1A2B3C4\n');
      quill.history.undo();
      expect(quill.getText()).toEqual('1234\n');
      quill.history.redo();
      expect(quill.getText()).toEqual('1A2B3C4\n');
      quill.history.undo();
      expect(quill.getText()).toEqual('1234\n');
      quill.history.redo();
      expect(quill.getText()).toEqual('1A2B3C4\n');
    });
  });
});
