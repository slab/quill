import { describe, expect, test } from 'vitest';
import Icons from '../../../src/ui/icons.js';

describe('Icons', () => {
  test('default icon set', () => {
    expect(Object.keys(Icons).length).toBe(23);
    expect(Object.keys(Icons)).toEqual([
      'align',
      'background',
      'blockquote',
      'bold',
      'clean',
      'code',
      'code-block',
      'color',
      'direction',
      'formula',
      'header',
      'italic',
      'image',
      'indent',
      'link',
      'list',
      'redo',
      'script',
      'strike',
      'table',
      'underline',
      'undo',
      'video',
    ]);
  });
});
