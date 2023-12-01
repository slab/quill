import { describe, expect, test } from 'vitest';
import Keyboard, { SHORTKEY, normalize } from '../../../src/modules/keyboard';

const assert = <T>(value: T | null | undefined): T => {
  if (value == null) {
    throw new Error();
  }
  return value;
};

const createKeyboardEvent = (key: string, override?: Partial<KeyboardEvent>) =>
  new KeyboardEvent('keydown', {
    key,
    shiftKey: false,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    ...override,
  });

describe('Keyboard', () => {
  describe('match', () => {
    test('no modifiers', () => {
      const binding = normalize({
        key: 'a',
      });
      expect(Keyboard.match(createKeyboardEvent('a'), assert(binding))).toBe(
        true,
      );
      expect(
        Keyboard.match(
          createKeyboardEvent('A', { altKey: true }),
          assert(binding),
        ),
      ).toBe(false);
    });

    test('simple modifier', () => {
      const binding = normalize({
        key: 'a',
        altKey: true,
      });
      expect(Keyboard.match(createKeyboardEvent('a'), assert(binding))).toBe(
        false,
      );
      expect(
        Keyboard.match(
          createKeyboardEvent('a', { altKey: true }),
          assert(binding),
        ),
      ).toBe(true);
    });

    test('optional modifier', () => {
      const binding = normalize({
        key: 'a',
        altKey: null,
      });
      expect(Keyboard.match(createKeyboardEvent('a'), assert(binding))).toBe(
        true,
      );
      expect(
        Keyboard.match(
          createKeyboardEvent('a', { altKey: true }),
          assert(binding),
        ),
      ).toBe(true);
    });

    test('shortkey modifier', () => {
      const binding = normalize({
        key: 'a',
        shortKey: true,
      });
      expect(Keyboard.match(createKeyboardEvent('a'), assert(binding))).toBe(
        false,
      );
      expect(
        Keyboard.match(
          createKeyboardEvent('a', { [SHORTKEY]: true }),
          assert(binding),
        ),
      ).toBe(true);
    });

    test('native shortkey modifier', () => {
      const binding = normalize({
        key: 'a',
        [SHORTKEY]: true,
      });
      expect(Keyboard.match(createKeyboardEvent('a'), assert(binding))).toBe(
        false,
      );
      expect(
        Keyboard.match(
          createKeyboardEvent('a', { [SHORTKEY]: true }),
          assert(binding),
        ),
      ).toBe(true);
    });
  });
});
