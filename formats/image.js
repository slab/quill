import Embed from '../blots/embed';


class Image extends Embed {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    }
    return node;
  }

  value() {
    return this.domNode.getAttribute('src') || true;
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';


export default Image;
