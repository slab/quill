import { beforeEach, describe, expect, test, vitest } from 'vitest';
import logger from '../../../src/core/logger.js';
import { findOrCreateSubscriber } from '../../../src/core/subscriber.js';

describe('Subscriber', () => {
  class Test {}
  let object: Test;

  beforeEach(() => {
    object = new Test();
  });

  describe('findOrCreateSubscriber()', () => {
    test('maps a Subscriber to an object', () => {
      const subscriber = findOrCreateSubscriber(object);
      expect(findOrCreateSubscriber(object)).toBe(subscriber);
      expect(findOrCreateSubscriber(new Test())).not.toBe(subscriber);
    });

    test('logs the creation of a new Subscriber instance', () => {
      logger.level('info');
      vitest.spyOn(console, 'info');
      findOrCreateSubscriber(object);
      expect(console.info).toHaveBeenCalledWith(
        'quill:subscriber',
        'Creating new Subscriber for Test',
      );
      findOrCreateSubscriber(object);
      expect(console.info).toHaveBeenCalledTimes(1);
      findOrCreateSubscriber(new Test());
      expect(console.info).toHaveBeenCalledTimes(2);
    });
  });

  describe('on()', () => {
    test('calls addEventListener on the target', () => {
      const subscriber = findOrCreateSubscriber(object);
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
      const subscriber = findOrCreateSubscriber(object);
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
      const subscriber = findOrCreateSubscriber(object);
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
      const subscriber = findOrCreateSubscriber(object);
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
      const subscriber = findOrCreateSubscriber(object);
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
      const subscriber = findOrCreateSubscriber(object);
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
