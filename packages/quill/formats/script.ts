import Inline from '../blots/inline';

class Script extends Inline {
  static blotName = 'script';
  static tagName = ['SUB', 'SUP'];

  static create(value: 'super' | 'sub' | (string & {})) {
    if (value === 'super') {
      return document.createElement('sup');
    }
    if (value === 'sub') {
      return document.createElement('sub');
    }
    return super.create(value);
  }

  static formats(domNode: HTMLElement) {
    if (domNode.tagName === 'SUB') return 'sub';
    if (domNode.tagName === 'SUP') return 'super';
    return undefined;
  }
}

export default Script;
