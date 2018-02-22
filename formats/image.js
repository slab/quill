import Parchment from 'parchment';
import { sanitize } from '../formats/link';

// override attributes to support image attributes.
//  alt, width, height, and style alignment )
// TODO: make checks to ensure style only contains the desired declarations
//      float; margin; display;
const ATTRIBUTES = [
  'src',
  'alt',
  'height',
  'width',
  'style'
];


class Image extends Parchment.Embed {

  static create(value) {
    const imageNode = ATTRIBUTES.reduce(function(node, attribute) {
      const attrPresent = Object.prototype.hasOwnProperty.call(value, attribute);
      if (attrPresent) {
        node.setAttribute(attribute, value[attribute]);
      }
      return node;
    }, super.create(value));

    // check for string only as in when uploading or dropping an image file
    if (typeof value === 'string') {
      imageNode.setAttribute('src', this.sanitize(value));
    }

    return imageNode;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return ATTRIBUTES.reduce(function(formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
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
Image.blotName = 'image';
Image.tagName = 'IMG';


export default Image;
