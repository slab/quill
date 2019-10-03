import Inline from '../blots/inline';


class Link extends Inline {
  static create(attributes) {
    let node = super.create(attributes);
    const href = this.sanitize(attributes.href);
    node.setAttribute('href', href);
    node.setAttribute('rel', 'noopener noreferrer');
    node.setAttribute('target', attributes.target);
    return node;
  }

  static formats(domNode) {
    const href = domNode.getAttribute('href');
    const target = domNode.getAttribute('target');
    return {href: href ? href : '', target: target ? target : '_blank'}
  }

  static sanitize(url) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name, attributes) {
    if(!attributes) {
      return super.format(name, '');
    }
    if (name !== this.statics.blotName || !attributes.href) return super.format(name, attributes.href);
    const href = this.constructor.sanitize(attributes.href);
    this.domNode.setAttribute('href', href);
    this.domNode.setAttribute('target', attributes.target);
  }
}
Link.blotName = 'link';
Link.tagName = 'A';
Link.SANITIZED_URL = 'about:blank';
Link.PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel'];


function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}


export { Link as default, sanitize };
