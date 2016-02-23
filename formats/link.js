import Inline from '../blots/inline';


class Link extends Inline {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      this.domNode.setAttribute('href', value);
    }
    return node;
  }

  format(name, value) {
    if (name !== 'link' || !value) return super.format(name, value);
    this.domNode.setAttribute('href', value);
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
