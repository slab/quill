import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { createSubscriber, getSubscriber } from '../../../src/core/subscriber';

describe('Subscriber', () => {
  class Test {}
  let object: Test;

  beforeEach(() => {
    object = new Test();
  });

  describe('registration', () => {
    test('maps a Subscriber to an object', () => {
      const subscriber = createSubscriber(object);
      expect(subscriber).toBeTruthy();
      expect(getSubscriber(object)).toBe(subscriber);
    });

    test('throws an error if no Subscriber is bound to an object', () => {
      expect(() => getSubscriber(object)).toThrow(
        'Subscriber not found for object Test',
      );
    });
  });

  describe('on()', () => {
    test('calls addEventListener on the target', () => {
      const subscriber = createSubscriber(object);
      const source = new Test();
      const target = document.createElement('div');
      const event = 'keydown';
      const handler = () => {};
      const options = {};
      vitest.spyOn(target, 'addEventListener');
      subscriber.on(source, target, event, handler, options);
      expect(target.addEventListener).toHaveBeenCalledWith(
        event,
        handler,
        options,
      );
    });

    test('keeps track of the subscription', () => {
      const subscriber = createSubscriber(object);
      const source = new Test();
      const target = document.createElement('div');
      const event = 'keydown';
      const handler = () => {};
      const options = {};
      subscriber.on(source, target, event, handler, options);
      expect(subscriber.getSubscriptions()).toEqual([
        { source, target, event, handler, options },
      ]);
    });
  });

  describe('off()', () => {
    test('calls removeEventListener on the target', () => {
      const subscriber = createSubscriber(object);
      const target = document.createElement('div');
      const event = 'keydown';
      const handler = () => {};
      const options = {};
      vitest.spyOn(target, 'removeEventListener');
      subscriber.off(target, event, handler, options);
      expect(target.removeEventListener).toHaveBeenCalledWith(
        event,
        handler,
        options,
      );
    });

    test('forgets the subscription', () => {
      const subscriber = createSubscriber(object);
      const source = new Test();
      const target = document.createElement('div');
      const event = 'keydown';
      const handler = () => {};
      const options = {};
      subscriber.on(source, target, event, handler, options);
      subscriber.off(target, event, handler, options);
      expect(subscriber.getSubscriptions()).toEqual([]);
    });
  });

  describe('removeSourceListeners()', () => {
    test('removes all listeners related to a source', () => {
      const subscriber = createSubscriber(object);
      const source1 = new Test();
      const source2 = new Test();
      const target1 = document.createElement('div');
      const target2 = document.createElement('div');
      const event = 'keydown';
      const handler = () => {};
      vitest.spyOn(target1, 'removeEventListener');
      vitest.spyOn(target2, 'removeEventListener');
      subscriber.on(source1, target1, event, handler);
      subscriber.on(source2, target2, event, handler);
      subscriber.removeSourceListeners(source1);
      expect(target1.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        handler,
        undefined,
      );
      expect(target2.removeEventListener).not.toHaveBeenCalled();
      expect(subscriber.getSubscriptions().length).toEqual(1);
      expect(subscriber.getSubscriptions()[0].source).toEqual(source2);
    });
  });

  describe('removeAllListeners()', () => {
    test('removes all listeners', () => {
      const subscriber = createSubscriber(object);
      const source1 = new Test();
      const source2 = new Test();
      const target1 = document.createElement('div');
      const target2 = document.createElement('div');
      const event = 'keydown';
      const handler = () => {};
      vitest.spyOn(target1, 'removeEventListener');
      vitest.spyOn(target2, 'removeEventListener');
      subscriber.on(source1, target1, event, handler);
      subscriber.on(source2, target2, event, handler);
      subscriber.removeAllListeners();
      expect(target1.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        handler,
        undefined,
      );
      expect(target2.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        handler,
        undefined,
      );
      expect(subscriber.getSubscriptions()).toEqual([]);
    });
  });
});
