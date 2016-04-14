import Inline from '../blots/inline';


class Link extends Inline {
  static create(value) {
    let node = super.create(value);
    value = this.sanitize(value);
    node.setAttribute('href', value);
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute('href');
  }

  static sanitize(url) {
    let anchor = document.createElement('a');
    anchor.href = url;
    let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
    if (['http', 'https', 'mailto'].indexOf(protocol) > -1) {
      return url;
    } else {
      return this.SANITIZED_URL;
    }
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value) return super.format(name, value);
    value = this.constructor.sanitize(value);
    this.domNode.setAttribute('href', value);
  }
}
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';


export default Link;
