import Delta from 'quill-delta';
import {
  createScroll as baseCreateScroll,
  createRegistry,
} from '../__helpers__/factory.js';
import Editor from '../../../src/core/editor.js';
import Video from '../../../src/formats/video.js';
import { describe, expect, test } from 'vitest';

const createScroll = (html: string) =>
  baseCreateScroll(html, createRegistry([Video]));

describe('Video', () => {
  test('add', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.insertEmbed(1, 'video', 'https://www.youtube.com/embed/QHH3iSeDBLo');
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert({ video: 'https://www.youtube.com/embed/QHH3iSeDBLo' })
        .insert('123\n'),
    );
    // BlockEmbed might insert a new line or behave differently than inline embed
    // Let's check the HTML structure
  });

  test('add invalid', () => {
    const editor = new Editor(createScroll('<p>0123</p>'));
    editor.insertEmbed(1, 'video', 'javascript:alert(0);'); // eslint-disable-line no-script-url
    expect(editor.getDelta()).toEqual(
      new Delta()
        .insert('0')
        .insert({ video: 'about:blank' })
        .insert('123\n'),
    );
  });
});
