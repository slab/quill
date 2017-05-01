import Keyboard, { SHORTKEY } from '../../../modules/keyboard';


describe('Keyboard', function() {
  describe('match', function() {
    it('no modifiers', function() {
      let binding = {
        key: 'a'
      };
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(true);
      expect(Keyboard.match({
        key: 'A',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: true
      }, binding)).toBe(false);
    });

    it('simple modifier', function() {
      let binding = {
        key: 'A',
        altKey: true
      };
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
      expect(Keyboard.match({
        key: 'A',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: true
      }, binding)).toBe(true);
    });

    it('optional modifier', function() {
      let binding = {
        key: 'a',
        altKey: null
      };
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(true);
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: true
      }, binding)).toBe(true);
    });

    it('shortkey modifier', function() {
      let binding = {
        key: 'a',
        shortKey: true
      };
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        [SHORTKEY]: true
      }, binding)).toBe(true);
    });

    it('native shortkey modifier', function() {
      let binding = {
        key: 'a',
        [SHORTKEY]: true
      };
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
      expect(Keyboard.match({
        key: 'a',
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        [SHORTKEY]: true
      }, binding)).toBe(true);
    });
  });
});
