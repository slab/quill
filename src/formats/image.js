import Parchment from 'parchment';


class Image extends Parchment.Embed {
  constructor(value) {
    super(value);
    if (typeof value === 'string') {
      this.domNode.setAttribute('src', value);
    }
  }

  getFormat() {
    let formats = super.getFormat();
    formats.image = this.domNode.getAttribute('src');
    return formats;
  }

  getValue() {
    return 1;
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';


Parchment.register(Image)

export { Image as default };
