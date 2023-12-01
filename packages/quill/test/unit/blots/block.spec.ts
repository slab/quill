import { describe, expect, test } from 'vitest';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import Header from '../../../src/formats/header';
import Bold from '../../../src/formats/bold';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Header, Bold]));

describe('Block', () => {
  test('childless', () => {
    const scroll = createScroll('');
    const block = scroll.create('block');
    // @ts-expect-error
    block.optimize();
    expect(block.domNode).toEqualHTML('<br>');
  });

  test('insert into empty', () => {
    const scroll = createScroll('');
    const block = scroll.create('block');
    block.insertAt(0, 'Test');
    expect(block.domNode).toEqualHTML('Test');
  });

  test('insert newlines', () => {
    const scroll = createScroll('<p><br></p>');
    scroll.insertAt(0, '\n\n\n');
    expect(scroll.domNode).toEqualHTML(
      '<p><br></p><p><br></p><p><br></p><p><br></p>',
    );
  });

  test('insert multiline', () => {
    const scroll = createScroll('<p>Hello World!</p>');
    scroll.insertAt(6, 'pardon\nthis\n\ninterruption\n');
    expect(scroll.domNode).toEqualHTML(`
      <p>Hello pardon</p>
      <p>this</p>
      <p><br></p>
      <p>interruption</p>
      <p>World!</p>
    `);
  });

  test('insert into formatted', () => {
    const scroll = createScroll('<h1>Welcome</h1>');
    scroll.insertAt(3, 'l\n');
    // @ts-expect-error
    expect(scroll.domNode.firstChild?.outerHTML).toEqualHTML('<h1>Well</h1>');
    // @ts-expect-error
    expect(scroll.domNode.childNodes[1]?.outerHTML).toEqualHTML(
      '<h1>come</h1>',
    );
  });

  test('delete line contents', () => {
    const scroll = createScroll('<p>Hello</p><p>World!</p>');
    scroll.deleteAt(0, 5);
    expect(scroll.domNode).toEqualHTML('<p><br></p><p>World!</p>');
  });

  test('join lines', () => {
    const scroll = createScroll('<h1>Hello</h1><h2>World!</h2>');
    scroll.deleteAt(5, 1);
    expect(scroll.domNode).toEqualHTML('<h2>HelloWorld!</h2>');
  });

  test('join line with empty', () => {
    const scroll = createScroll(
      '<p>Hello<strong>World</strong></p><p><br></p>',
    );
    scroll.deleteAt(10, 1);
    expect(scroll.domNode).toEqualHTML('<p>Hello<strong>World</strong></p>');
  });

  test('join empty lines', () => {
    const scroll = createScroll('<h1><br></h1><p><br></p>');
    scroll.deleteAt(1, 1);
    expect(scroll.domNode).toEqualHTML('<h1><br></h1>');
  });

  test('format empty', () => {
    const scroll = createScroll('<p><br></p>');
    scroll.formatAt(0, 1, 'header', 1);
    expect(scroll.domNode).toEqualHTML('<h1><br></h1>');
  });

  test('format newline', () => {
    const scroll = createScroll('<h1>Hello</h1>');
    scroll.formatAt(5, 1, 'header', 2);
    expect(scroll.domNode).toEqualHTML('<h2>Hello</h2>');
  });

  test('remove unnecessary break', () => {
    const scroll = createScroll('<p>Test</p>');
    scroll.children.head?.domNode.appendChild(document.createElement('br'));
    scroll.update();
    expect(scroll.domNode).toEqualHTML('<p>Test</p>');
  });
});
