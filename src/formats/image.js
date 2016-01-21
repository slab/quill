import Parchment from 'parchment';
import Embed from '../blots/embed';


class Image extends Embed {
  value() {
    return this.domNode.getAttribute('src') || true;
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';
Image.create = function(value) {
  let node = Parchment.Embed.create.call(Image);
  if (typeof value === 'string') {
    node.setAttribute('src', value);
  }
  return node;
};


Parchment.register(Image);

export default Image;
