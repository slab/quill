import Keyboard, { SHORTKEY } from '../../../modules/keyboard';


describe('Keyboard', function() {
  describe('match', function() {
    it('no modifiers', function() {
      let binding = {
        key: 'a'
      };
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(true);
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: true,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
    });

    it('simple modifier', function() {
      let binding = {
        key: 'a',
        shiftKey: true
      };
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: true,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(true);
    });

    it('optional modifier', function() {
      let binding = {
        key: 'a',
        shiftKey: null
      };
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(true);
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: true,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(true);
    });

    it('shortkey modifier', function() {
      let binding = {
        key: 'a',
        shortKey: true
      };
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
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
        keyCode: 'A'.charCodeAt(0),
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false
      }, binding)).toBe(false);
      expect(Keyboard.match({
        keyCode: 'A'.charCodeAt(0),
        shiftKey: false,
        metaKey: false,
        ctrlKey: false,
        altKey: false,
        [SHORTKEY]: true
      }, binding)).toBe(true);
    });
  });
});
