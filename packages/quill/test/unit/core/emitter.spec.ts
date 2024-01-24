import { describe, expect, test } from 'vitest';
import Emitter from '../../../src/core/emitter';
import Quill from '../../../src/core';

describe('emitter', () => {
  test('emit and on', () => {
    const emitter = new Emitter();

    let received: unknown;
    emitter.on('abc', (data) => {
      received = data;
    });
    emitter.emit('abc', { hello: 'world' });

    expect(received).toEqual({ hello: 'world' });
  });

  test('listenDOM', () => {
    const quill = new Quill(document.createElement('div'));
    document.body.appendChild(quill.container);

    let calls = 0;
    quill.emitter.listenDOM('click', document.body, () => {
      calls += 1;
    });

    document.body.click();
    expect(calls).toEqual(1);

    quill.container.remove();
    document.body.click();
    expect(calls).toEqual(1);

    document.body.appendChild(quill.container);
    document.body.click();
    expect(calls).toEqual(2);
  });
});
