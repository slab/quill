import Parchment from 'parchment';


class Image extends Parchment.Embed {
  format(name, value) {
    // TODO implement
  }

  formats() {
    return {};
  }

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

export { Image as default };
