import { BlockEmbed } from '../blots/block';
import Link from '../formats/link';


class Video extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute('src', this.sanitize(value));
    node.setAttribute('controls', true);
    node.setAttribute('contenteditable', false);
    return node;
  }

  static formats(domNode) {
    let formats = {};
    if (domNode.hasAttribute('height')) formats['height'] = domNode.getAttribute('height');
    if (domNode.hasAttribute('width')) formats['width'] = domNode.getAttribute('width');
    return formats;
  }

  static sanitize(url) {
    return Link.sanitize(url);
  }

  static value(domNode) {
    return domNode.getAttribute('src');
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
}
Video.blotName = 'video';
Video.tagName = 'VIDEO';


export default Video;
