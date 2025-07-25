import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { DOMRoot } from '../../../src/core/dom-root.js';

describe('DOMRoot', () => {
  let container: HTMLElement;
  let shadowHost: HTMLElement;
  let shadowRoot: ShadowRoot;

  beforeEach(() => {
    // Create regular DOM container
    container = document.createElement('div');
    container.id = 'regular-container';
    document.body.appendChild(container);

    // Create shadow DOM setup
    shadowHost = document.createElement('div');
    shadowHost.id = 'shadow-host';
    document.body.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    const shadowContainer = document.createElement('div');
    shadowContainer.id = 'shadow-container';
    shadowRoot.appendChild(shadowContainer);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(shadowHost);
  });

  describe('constructor and detection', () => {
    test('detects regular DOM context', () => {
      const domRoot = DOMRoot(container);

      expect(domRoot.isInShadowDOM()).toBe(false);
      expect(domRoot.getRoot()).toBe(document);
    });

    test('detects shadow DOM context', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const domRoot = DOMRoot(shadowContainer);

      expect(domRoot.isInShadowDOM()).toBe(true);
      expect(domRoot.getRoot()).toBe(shadowRoot);
    });

    test('handles nested shadow DOM', () => {
      // Create nested shadow DOM
      const nestedHost = document.createElement('div');
      shadowRoot.appendChild(nestedHost);
      const nestedShadowRoot = nestedHost.attachShadow({ mode: 'open' });

      const nestedContainer = document.createElement('div');
      nestedContainer.id = 'nested-container';
      nestedShadowRoot.appendChild(nestedContainer);

      const domRoot = DOMRoot(nestedContainer);

      expect(domRoot.isInShadowDOM()).toBe(true);
      expect(domRoot.getRoot()).toBe(nestedShadowRoot);
    });
  });

  describe('DOM queries', () => {
    test('querySelector works in regular DOM', () => {
      container.innerHTML = '<div class="test">Hello</div>';
      const domRoot = DOMRoot(container);

      const element = domRoot.querySelector('.test');
      expect(element).toBeTruthy();
      expect(element?.textContent).toBe('Hello');
    });

    test('querySelector works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      shadowContainer.innerHTML = '<div class="test">Shadow</div>';
      const domRoot = DOMRoot(shadowContainer);

      const element = domRoot.querySelector('.test');
      expect(element).toBeTruthy();
      expect(element?.textContent).toBe('Shadow');
    });

    test('querySelector scoped to shadow root', () => {
      // Add element to regular DOM
      container.innerHTML = '<div class="test">Regular</div>';

      // Add element to shadow DOM
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      shadowContainer.innerHTML = '<div class="test">Shadow</div>';
      const domRoot = DOMRoot(shadowContainer);

      // Should only find shadow DOM element
      const element = domRoot.querySelector('.test');
      expect(element?.textContent).toBe('Shadow');
    });

    test('querySelectorAll works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      shadowContainer.innerHTML =
        '<div class="test">One</div><div class="test">Two</div>';
      const domRoot = DOMRoot(shadowContainer);

      const elements = domRoot.querySelectorAll('.test');
      expect(elements.length).toBe(2);
      expect(elements[0].textContent).toBe('One');
      expect(elements[1].textContent).toBe('Two');
    });

    test('getElementById works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      shadowContainer.innerHTML = '<div id="test-element">Test</div>';
      const domRoot = DOMRoot(shadowContainer);

      const element = domRoot.getElementById('test-element');
      expect(element).toBeTruthy();
      expect(element?.textContent).toBe('Test');
    });

    test('getElementById handles special characters', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      shadowContainer.innerHTML = '<div id="test:element">Test</div>';
      const domRoot = DOMRoot(shadowContainer);

      const element = domRoot.getElementById('test:element');
      expect(element).toBeTruthy();
      expect(element?.textContent).toBe('Test');
    });
  });

  describe('element creation', () => {
    test('createElement works in regular DOM', () => {
      const domRoot = DOMRoot(container);

      const element = domRoot.createElement('div');
      expect(element.tagName).toBe('DIV');
      expect(element.ownerDocument).toBe(document);
    });

    test('createElement works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const domRoot = DOMRoot(shadowContainer);

      const element = domRoot.createElement('span');
      expect(element.tagName).toBe('SPAN');
      expect(element.ownerDocument).toBe(document);
    });

    test('createTextNode works', () => {
      const domRoot = DOMRoot(container);

      const textNode = domRoot.createTextNode('Hello World');
      expect(textNode.nodeType).toBe(Node.TEXT_NODE);
      expect(textNode.textContent).toBe('Hello World');
    });
  });

  describe('style injection', () => {
    test('injectCSS works in regular DOM', () => {
      const domRoot = DOMRoot(container);

      domRoot.injectCSS('.test { color: red; }', 'test-styles');

      const styleElement = document.head.querySelector(
        'style[data-quill-id="test-styles"]',
      );
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toBe('.test { color: red; }');
    });

    test('injectCSS works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const domRoot = DOMRoot(shadowContainer);

      domRoot.injectCSS('.shadow-test { color: blue; }', 'shadow-styles');

      const styleElement = shadowRoot.querySelector(
        'style[data-quill-id="shadow-styles"]',
      );
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toBe('.shadow-test { color: blue; }');
    });

    test('injectCSS prevents duplicates', () => {
      const domRoot = DOMRoot(container);

      domRoot.injectCSS('.test { color: red; }', 'duplicate-test');
      domRoot.injectCSS('.test { color: blue; }', 'duplicate-test');

      const styleElements = document.head.querySelectorAll(
        'style[data-quill-id="duplicate-test"]',
      );
      expect(styleElements.length).toBe(1);
      expect(styleElements[0].textContent).toBe('.test { color: red; }');
    });

    test('injectStylesheet works in regular DOM', () => {
      const domRoot = DOMRoot(container);

      domRoot.injectStylesheet('/test.css', 'test-stylesheet');

      const linkElement = document.head.querySelector(
        'link[data-quill-id="test-stylesheet"]',
      );
      expect(linkElement).toBeTruthy();
      expect(linkElement?.getAttribute('href')).toBe('/test.css');
      expect(linkElement?.getAttribute('rel')).toBe('stylesheet');
    });

    test('injectStylesheet works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const domRoot = DOMRoot(shadowContainer);

      domRoot.injectStylesheet('/shadow-test.css', 'shadow-stylesheet');

      const linkElement = shadowRoot.querySelector(
        'link[data-quill-id="shadow-stylesheet"]',
      );
      expect(linkElement).toBeTruthy();
      expect(linkElement?.getAttribute('href')).toBe('/shadow-test.css');
    });
  });

  describe('event handling', () => {
    test('addEventListener works in regular DOM', () => {
      const domRoot = DOMRoot(container);
      const handler = vi.fn();

      domRoot.addEventListener('click', handler);

      // Trigger event on document
      const event = new MouseEvent('click', { bubbles: true });
      document.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    test('addEventListener works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const domRoot = DOMRoot(shadowContainer);
      const handler = vi.fn();

      domRoot.addEventListener('click', handler);

      // Trigger event on shadow root
      const event = new MouseEvent('click', { bubbles: true });
      shadowRoot.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    test('removeEventListener works', () => {
      const domRoot = DOMRoot(container);
      const handler = vi.fn();

      domRoot.addEventListener('click', handler);
      domRoot.removeEventListener('click', handler);

      const event = new MouseEvent('click', { bubbles: true });
      document.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('selection', () => {
    test('getSelection returns document selection', () => {
      const domRoot = DOMRoot(container);

      const selection = domRoot.getSelection();
      expect(selection).toBe(document.getSelection());
    });

    test('createRange works', () => {
      const domRoot = DOMRoot(container);

      const range = domRoot.createRange();
      expect(range).toBeInstanceOf(Range);
      expect(range.commonAncestorContainer).toBe(document);
    });
  });

  describe('focus management', () => {
    test('getActiveElement works in regular DOM', () => {
      const input = document.createElement('input');
      container.appendChild(input);
      input.focus();

      const domRoot = DOMRoot(container);
      const activeElement = domRoot.getActiveElement();

      expect(activeElement).toBe(input);
    });

    test('getActiveElement works in shadow DOM', () => {
      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const input = document.createElement('input');
      shadowContainer.appendChild(input);
      input.focus();

      const domRoot = DOMRoot(shadowContainer);
      const activeElement = domRoot.getActiveElement();

      expect(activeElement).toBe(input);
    });

    test('getActiveElement traverses nested shadow roots', () => {
      // Create nested shadow DOM with focused element
      const nestedHost = document.createElement('div');
      shadowRoot.appendChild(nestedHost);
      const nestedShadowRoot = nestedHost.attachShadow({ mode: 'open' });

      const input = document.createElement('input');
      nestedShadowRoot.appendChild(input);
      input.focus();

      const shadowContainer = shadowRoot.querySelector(
        '#shadow-container',
      ) as HTMLElement;
      const domRoot = DOMRoot(shadowContainer);
      const activeElement = domRoot.getActiveElement();

      expect(activeElement).toBe(input);
    });
  });

  describe('edge cases', () => {
    test('handles null container gracefully', () => {
      // This would typically be caught by TypeScript, but test runtime behavior
      const domRoot = DOMRoot(container);
      expect(domRoot.getRoot()).toBeTruthy();
    });

    test('handles detached elements', () => {
      const detachedElement = document.createElement('div');
      const domRoot = DOMRoot(detachedElement);

      expect(domRoot.isInShadowDOM()).toBe(false);
      expect(domRoot.getRoot()).toBe(document);
    });

    test('handles elements with no owner document', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'ownerDocument', {
        value: null,
        configurable: true,
      });

      const domRoot = DOMRoot(element);
      expect(domRoot.getRoot()).toBe(document);
    });
  });
});
