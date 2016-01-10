import Parchment from 'parchment';


class Image extends Parchment.Embed {
  getValue() {
    return {
      image: {
        url: this.domNode.getAttribute('src')
      }
    };
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';
Image.create = function(value) {
  var node = Parchment.Embed.create();
  node.setAttribute('src', value.url);
  return node;
};


Parchment.register(Image);

export { Image as default };
