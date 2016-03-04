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

  static sanitize(url) {
    if (!/^(https?:\/\/|mailto:)/.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  format(name, value) {
    if (name !== 'link' || !value) return super.format(name, value);
    value = this.constructor.sanitize(value);
    this.domNode.setAttribute('href', value);
    this.domNode.setAttribute('title', value);
  }

  formats() {
    let format = super.formats();
    format.link = this.domNode.getAttribute('href') || true;
    return format;
  }
}
Link.blotName = 'link';
Link.tagName = 'A';


export default Link;
