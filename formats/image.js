import Embed from '../blots/embed';
import Link, { sanitize } from '../formats/link';


class Image extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static formats(domNode) {
    let formats = {};
    if (domNode.hasAttribute('height')) formats['height'] = domNode.getAttribute('height');
    if (domNode.hasAttribute('width')) formats['width'] = domNode.getAttribute('width');
    return formats;
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (name === 'height' || name === 'width') {
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
Image.blotName = 'image';
Image.tagName = 'IMG';


export default Image;
