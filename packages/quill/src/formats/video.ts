import { BlockEmbed } from '../blots/block.js';
import Link from './link.js';

const ATTRIBUTES = [
  'title',
  'sandbox',
  'referrerpolicy',
  'name',
  'src',
  'srcdoc',
  'width',
  'height',
  'frameborder',
  'allowfullscreen',
  'allow',
  'loading',
  'allowpaymentrequest',
];

class Video extends BlockEmbed {
  static blotName = 'video';
  static className = 'ql-video';
  static tagName = 'IFRAME';

  static create(value: any) {
    console.log('formats', value);
    const node = document.createElement('iframe');
    ATTRIBUTES.forEach((attr) => {
      if (value[attr]) {
        node.setAttribute(attr, value[attr]);
      }
    });
    return node;
  }

  static formats(domNode: Element) {
    console.log('formats', domNode);
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
    console.log('value', domNode);
    return ATTRIBUTES.reduce((acc: any, attr) => {
      acc[attr] = domNode.getAttribute(attr);
      return acc;
    }, {});
  }

  domNode: HTMLVideoElement;

  format(name: string, value: string) {
    console.log('format', name, value);
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
    console.log('html', this.value());
    console.log('html', this.domNode);
    console.log('html', Video.create(this.value().video));
    return Video.create(this.value().video).outerHTML;
  }
}

export default Video;
