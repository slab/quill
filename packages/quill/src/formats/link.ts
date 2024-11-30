import Inline from '../blots/inline.js';

class Link extends Inline {
  static blotName = 'link';
  static tagName = 'A';
  static SANITIZED_URL = 'about:blank';
  static PROTOCOL_WHITELIST = ['http', 'https', 'mailto', 'tel', 'sms'];

  static create(value: string) {
    const node = super.create();
    let newValue;
    if (isStringified(value)) {
      newValue = JSON.parse(value);
    } else {
      newValue = value;
    }

    if (typeof newValue !== 'string') {
      ['href', 'target', 'title'].forEach((attr) => {
        if (newValue[attr]) node.setAttribute(attr, newValue[attr]);
      });
      return node;
    }

    node.setAttribute('href', newValue);
    return node;
  }

  static formats(domNode: HTMLElement) {
    return JSON.stringify({
      href: domNode.getAttribute('href'),
      target: domNode.getAttribute('target'),
      title: domNode.getAttribute('title'),
    });
  }

  static sanitize(url: string) {
    return sanitize(url, this.PROTOCOL_WHITELIST) ? url : this.SANITIZED_URL;
  }

  format(name: string, value: any) {
    if (name !== this.statics.blotName || !value) {
      return super.format(name, value);
    }
    let newValue;
    if (isStringified(value)) {
      newValue = JSON.parse(value);
    } else {
      newValue = value;
    }

    if (typeof newValue !== 'string') {
      this.domNode.setAttribute('href', newValue.href);
      this.domNode.setAttribute('target', newValue.target);
      this.domNode.setAttribute('title', newValue.title);
    } else {
      this.domNode.setAttribute('href', newValue);
    }
  }
}

function isStringified(value: any) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

function sanitize(url: string, protocols: string[]) {
  const anchor = document.createElement('a');
  anchor.href = url;
  const protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

export { Link as default, sanitize };
