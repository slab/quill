import { EmbedBlock } from '../blots/block';
import Link from './link';


class Video extends EmbedBlock {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('src', this.sanitize(value));
    node.setAttribute('controls', true);
    node.setAttribute('contenteditable', false);
    return node;
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  constructor(domNode) {
    super(domNode);
    this.domNode.addEventListener('mouseenter', () => {
      this.domNode.setAttribute('controls', true);
    });
    this.domNode.addEventListener('mouseleave', () => {
      this.domNode.removeAttribute('controls');
    });
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

  formats() {
    return {
      height: this.domNode.getAttribute('height') || undefined,
      width: this.domNode.getAttribute('width') || undefined
    };
  }

  value() {
    return this.domNode.getAttribute('src') || true;
  }
}
Video.blotName = 'video';
Video.tagName = 'VIDEO';


export default Video;
