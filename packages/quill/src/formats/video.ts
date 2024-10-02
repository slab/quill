import { BlockEmbed } from '../blots/block.js';
import Link from './link.js';

const ATTRIBUTES = [
  'src',
  'srcdoc',
  'name',
  'width',
  'height',
  'frameborder',
  'allow',
  'allowfullscreen',
  'sandbox',
  'referrerpolicy',
  'loading',
  'longdesc',
  'title',
  'class',
  'id',
  'style',
  'tabindex',
  'draggable',
  'scrolling',
];

class Video extends BlockEmbed {
  static blotName = 'video';
  static className = 'ql-video';
  static tagName = 'IFRAME';

  static create(value: any) {
    const node = document.createElement('iframe');
    ATTRIBUTES.forEach((attr) => {
      if (value[attr]) {
        node.setAttribute(attr, value[attr]);
      }
    });
    return node;
  }

  static formats(domNode: Element) {
    return ATTRIBUTES.reduce(
      (formats: Record<string, string | null>, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {},
    );
  }

  static sanitize(url: string) {
    return Link.sanitize(url);
  }

  static value(domNode: Element) {
    return ATTRIBUTES.reduce((acc: any, attr) => {
      acc[attr] = domNode.getAttribute(attr);
      return acc;
    }, {});
  }

  domNode: HTMLVideoElement;

  format(name: string, value: string) {
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

  html() {
    return Video.create(this.value().video).outerHTML;
  }
}

export default Video;
