import Embed from '../blots/embed';


class Image extends Embed {
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
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  value() {
    return this.domNode.getAttribute('src') || true;
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';


export default Image;
