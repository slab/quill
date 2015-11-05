import Parchment from 'parchment';


class Image extends Parchment.Embed {
  constructor(value) {
    super(value);
    if (typeof value === 'object') {
      this.domNode.setAttribute('src', value.url);
    }
  }

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


Parchment.register(Image);

export { Image as default };
