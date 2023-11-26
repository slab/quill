import { expect } from 'vitest';
import { normalizeHTML } from './utils';

const sortAttributes = (element: HTMLElement) => {
  const attributes = Array.from(element.attributes);
  const sortedAttributes = attributes.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  while (element.attributes.length > 0) {
    element.removeAttribute(element.attributes[0].name);
  }

  for (const attr of sortedAttributes) {
    element.setAttribute(attr.name, attr.value);
  }

  element.childNodes.forEach((child) => {
    if (child instanceof HTMLElement) {
      sortAttributes(child);
    }
  });
};

expect.extend({
  toEqualHTML(received, expected, options: { ignoreAttrs?: string[] } = {}) {
    const ignoreAttrs = options?.ignoreAttrs ?? [];
    const receivedDOM = document.createElement('div');
    const expectedDOM = document.createElement('div');
    receivedDOM.innerHTML = normalizeHTML(
      typeof received === 'string' ? received : received.innerHTML,
    );
    expectedDOM.innerHTML = normalizeHTML(expected);

    const doms = [receivedDOM, expectedDOM];

    doms.forEach((dom) => {
      Array.from(dom.querySelectorAll('.ql-ui')).forEach((node) => {
        node.remove();
      });

      ignoreAttrs.forEach((attr) => {
        Array.from(dom.querySelectorAll(`[${attr}]`)).forEach((node) => {
          node.removeAttribute(attr);
        });
      });

      sortAttributes(dom);
    });

    if (this.equals(receivedDOM.innerHTML, expectedDOM.innerHTML)) {
      return { pass: true, message: () => '' };
    }
    return {
      pass: false,
      message: () =>
        `HTMLs don't match.\n${this.utils.diff(
          this.utils.stringify(receivedDOM),
          this.utils.stringify(expectedDOM),
        )}`,
    };
  },
});
