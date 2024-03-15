import '../../../../src/quill.js';
import { describe, expect, test, vitest } from 'vitest';
import createRegistryWithFormats from '../../../../src/core/utils/createRegistryWithFormats.js';
import { globalRegistry } from '../../../../src/core/quill.js';
import logger from '../../../../src/core/logger.js';
import { Registry } from 'parchment';
import Inline from '../../../../src/blots/inline.js';
import Container from '../../../../src/blots/container.js';

const debug = logger('test');

describe('createRegistryWithFormats', () => {
  test('register core formats', () => {
    const registry = createRegistryWithFormats([], globalRegistry, debug);
    expect(registry.query('cursor')).toBeTruthy();
    expect(registry.query('bold')).toBeFalsy();
  });

  test('register specified formats', () => {
    const registry = createRegistryWithFormats(['bold'], globalRegistry, debug);
    expect(registry.query('cursor')).toBeTruthy();
    expect(registry.query('bold')).toBeTruthy();
  });

  test('register required container', () => {
    const sourceRegistry = new Registry();

    class RequiredContainer extends Container {
      static blotName = 'my-required-container';
    }
    class Child extends Inline {
      static requiredContainer = RequiredContainer;
      static blotName = 'my-child';
    }

    sourceRegistry.register(Child);

    const registry = createRegistryWithFormats(
      ['my-child'],
      sourceRegistry,
      debug,
    );

    expect(registry.query('my-child')).toBeTruthy();
    expect(registry.query('my-required-container')).toBeTruthy();
  });

  test('infinite loop', () => {
    const sourceRegistry = new Registry();

    class InfiniteBlot extends Inline {
      static requiredContainer = InfiniteBlot;
      static blotName = 'infinite-blot';
    }

    sourceRegistry.register(InfiniteBlot);

    const logError = vitest.spyOn(debug, 'error');
    const registry = createRegistryWithFormats(
      ['infinite-blot'],
      sourceRegistry,
      debug,
    );

    expect(registry.query('infinite-blot')).toBeTruthy();
    expect(logError).toHaveBeenCalledWith(
      expect.stringMatching('Cycle detected'),
    );
  });

  test('report missing formats', () => {
    const logError = vitest.spyOn(debug, 'error');
    const registry = createRegistryWithFormats(
      ['my-unknown'],
      globalRegistry,
      debug,
    );
    expect(registry.query('my-unknown')).toBeFalsy();
    expect(logError).toHaveBeenCalledWith(expect.stringMatching('my-unknown'));
  });
});
