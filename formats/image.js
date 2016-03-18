import Parchment from 'parchment';
import Link from './link';


class Image extends Parchment.Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static match(url) {
    return /^https?:\/\/.+\.(jpe?g|gif|png)$/.test(url);
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';


export default Image;
