import { EmbedBlot } from 'parchment';
// import { sanitize } from './link.js';

const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'src',
  'srcset',
  'sizes',
  'crossorigin',
  'usemap',
  'ismap',
  'loading',
  'referrerpolicy',
  'decoding',
  'longdesc',
  'title',
  'class',
  'id',
  'style',
  'tabindex',
  'draggable',
  'align',
  'border',
  'hspace',
  'vspace',
  'accesskey',
];

class Image extends EmbedBlot {
  static blotName = 'image';
  static tagName = 'IMG';

  static create(value: any) {
    const node = document.createElement('img');
    ATTRIBUTES.forEach((attr) => {
      if (value[attr]) {
        node.setAttribute(attr, value[attr]);
      }
    });
    return node;
  }

  static formats(domNode: Element) {
    return ATTRIBUTES.reduce(
      (formats: Record<string, string | null>, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {},
    );
  }

  static match(url: string) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url: string) {
    return url;
  }

  static value(domNode: Element) {
    return ATTRIBUTES.reduce((acc: any, attr) => {
      acc[attr] = domNode.getAttribute(attr);
      return acc;
    }, {});
  }

  domNode: HTMLImageElement;

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default Image;
