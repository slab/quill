import Inline from '../blots/inline';


class Link extends Inline {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      value = this.sanitize(value);
      node.setAttribute('href', value);
      node.setAttribute('title', value);
    }
    return node;
  }

  static formats(domNode) {
    let formats = {};
    if (domNode.hasAttribute('href')) {
      formats[this.blotName] = domNode.getAttribute('href')
    }
    return formats;
  }

  static sanitize(url) {
    return url.replace(/[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]/g, '');
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value) return super.format(name, value);
    value = this.constructor.sanitize(value);
    this.domNode.setAttribute('href', value);
    this.domNode.setAttribute('title', value);
  }
}
Link.blotName = 'link';
Link.tagName = 'A';


export default Link;
