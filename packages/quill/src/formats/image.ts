import { EmbedBlot } from 'parchment';
import { sanitize } from './link.js';
import { escapeText } from '../blots/text.js';

const ATTRIBUTES = ['alt', 'height', 'width'];

class Image extends EmbedBlot {
  static blotName = 'image';
  static tagName = 'IMG';

  static create(value: string) {
    const node = super.create(value) as Element;
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
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
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode: Element) {
    return domNode.getAttribute('src');
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

  html() {
    const { src, alt, width, height } = this.domNode;
    const sanitizedSrc = Image.sanitize(src);
    const sanitizedAlt = alt ? escapeText(alt) : '';

    let attributes = `src="${escapeText(sanitizedSrc)}"`;
    if (sanitizedAlt) {
      attributes += ` alt="${sanitizedAlt}"`;
    }
    if (width) {
      attributes += ` width="${escapeText(String(width))}"`;
    }
    if (height) {
      attributes += ` height="${escapeText(String(height))}"`;
    }

    return `<img ${attributes}>`;
  }
}

export default Image;
