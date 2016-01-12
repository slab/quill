import Parchment from 'parchment';


class Image extends Parchment.Embed {
  getValue() {
    return { image: this.domNode.getAttribute('src') };
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';
Image.create = function(value) {
  let node = Parchment.Embed.create.call(Image);    // TODO Babel does not bind for us?
  node.setAttribute('src', value);
  return node;
};


Parchment.register(Image);

export { Image as default };
