import { expect } from 'vitest';
import Cursor from '../../../blots/cursor';
import { Blot, ContainerBlot, ScrollBlot } from 'parchment';
import { normalizeHTML } from './utils';

expect.addSnapshotSerializer({
  serialize(val) {
    return val.outerHTML.replace(Cursor.CONTENTS, '{Cursor.CONTENTS}');
  },
  test(val) {
    return val instanceof HTMLElement && val.classList.contains('ql-cursor');
  },
});

expect.addSnapshotSerializer({
  serialize() {
    return '';
  },
  test(val) {
    return val instanceof HTMLElement && val.classList.contains('ql-ui');
  },
});

interface Config {
  indent: string;
  min: boolean;
  spacingOuter: string;
  spacingInner: string;
}

const printBlot = (
  blot: Blot,
  config: Config,
  indentation: string,
  depth: number,
  refs: unknown,
  printer: (
    value: unknown,
    config: Config,
    indentation: string,
    depth: number,
    refs: unknown,
  ) => string,
) => {
  const isScroll = blot instanceof ScrollBlot;
  if (isScroll || blot instanceof ContainerBlot) {
    const html = printer(
      blot.domNode,
      {
        ...config,
        min: true,
        indent: '',
        spacingOuter: '',
        spacingInner: ' ',
      },
      '',
      depth,
      refs,
    );
    const childNodes = blot.children
      .map(child => {
        return (
          indentation +
          printBlot(
            child,
            config,
            indentation + config.indent,
            depth,
            refs,
            printer,
          )
        );
      })
      .join('\n');

    if (isScroll) return childNodes;
    const openTag = html.slice(0, html.indexOf('>') + 1);
    const endTag = html.slice(html.lastIndexOf('<'));

    return `${openTag}\n${childNodes}\n${indentation.slice(
      config.indent.length,
    )}${endTag}`;
  }
  return printer(
    blot.domNode,
    { ...config, min: true, indent: '', spacingInner: ' ', spacingOuter: '' },
    '',
    depth,
    refs,
  );
};

expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    return printBlot(val, config, indentation, depth, refs, printer);
  },
  test(blot) {
    return typeof blot === 'object' && 'statics' in blot;
  },
});

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

  element.childNodes.forEach(child => {
    if (child instanceof HTMLElement) {
      sortAttributes(child);
    }
  });
};

expect.extend({
  toEqualHTML(received, expected, options) {
    const ignoreAttrs = options?.ignoreAttrs ?? [];
    const receivedDOM = document.createElement('div');
    const expectedDOM = document.createElement('div');
    receivedDOM.innerHTML = normalizeHTML(
      typeof received === 'string' ? received : received.innerHTML,
    );
    expectedDOM.innerHTML = normalizeHTML(expected);

    const doms = [receivedDOM, expectedDOM];

    doms.forEach(dom => {
      Array.from(dom.querySelectorAll('.ql-ui')).forEach(node => {
        node.remove();
      });

      ignoreAttrs.forEach(attr => {
        Array.from(dom.querySelectorAll(`[${attr}]`)).forEach(node => {
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
        `expected ${receivedDOM.innerHTML} to match html ${expectedDOM.innerHTML}`,
    };
  },
});
