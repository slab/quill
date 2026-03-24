import { BlockEmbed } from '../blots/block.js';
import { escapeAttribute, escapeHtml } from '../core/html_escape.js';
import Link from './link.js';

const ATTRIBUTES = ['height', 'width'];

class Video extends BlockEmbed {
  static blotName = 'video';
  static className = 'ql-video';
  static tagName = 'IFRAME';

  static create(value: string) {
    const node = super.create(value) as Element;
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', 'true');
    node.setAttribute('src', this.sanitize(value));
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
    return domNode.getAttribute('src');
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
    const raw = this.domNode.getAttribute('src') ?? '';
    const safe = Video.sanitize(raw);
    return `<a href="${escapeAttribute(safe)}">${escapeHtml(safe)}</a>`;
  }
}

export default Video;
