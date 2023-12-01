import { describe, expect, test } from 'vitest';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory';
import Video from '../../../src/formats/video';
import Image from '../../../src/formats/image';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Video, Image]));

describe('Block Embed', () => {
  test('insert', () => {
    const scroll = createScroll('<p>0123</p>');
    scroll.insertAt(2, 'video', '#');
    expect(scroll.domNode).toEqualHTML(`
      <p>01</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p>23</p>
    `);
  });

  test('split newline', () => {
    const scroll = createScroll('<p>0123</p>');
    scroll.insertAt(4, 'video', '#');
    expect(scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p><br></p>
    `);
  });

  test('insert end of document', () => {
    const scroll = createScroll('<p>0123</p>');
    scroll.insertAt(5, 'video', '#');
    expect(scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert text before', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(0, 'Test');
    expect(scroll.domNode).toEqualHTML(`
      <p>Test</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert text after', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(1, 'Test');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p>Test</p>
    `);
  });

  test('insert inline embed before', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(0, 'image', '/assets/favicon.png');
    expect(scroll.domNode).toEqualHTML(`
      <p><img src="/assets/favicon.png"></p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert inline embed after', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(1, 'image', '/assets/favicon.png');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p><img src="/assets/favicon.png"></p>
    `);
  });

  test('insert block embed before', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(0, 'video', '#1');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#1" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert block embed after', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(1, 'video', '#1');
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <iframe src="#1" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert newline before', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(0, '\n');
    scroll.optimize();
    expect(scroll.domNode).toEqualHTML(`
      <p><br></p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert multiple newlines before', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(0, '\n\n\n');
    scroll.optimize();
    expect(scroll.domNode).toEqualHTML(`
      <p><br></p>
      <p><br></p>
      <p><br></p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });

  test('insert newline after', () => {
    const scroll = createScroll(
      '<iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.insertAt(1, '\n');
    scroll.optimize();
    expect(scroll.domNode).toEqualHTML(`
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
      <p><br></p>
    `);
  });

  test('delete preceding newline', () => {
    const scroll = createScroll(
      '<p>0123</p><iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>',
    );
    scroll.deleteAt(4, 1);
    expect(scroll.domNode).toEqualHTML(`
      <p>0123</p>
      <iframe src="#" class="ql-video" frameborder="0" allowfullscreen="true"></iframe>
    `);
  });
});
