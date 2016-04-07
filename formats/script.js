import Inline from 'quill/blots/inline';

class Script extends Inline {
  static create(value) {
    if (value === 'super') {
      return document.createElement('sup');
    } else if (value === 'sub') {
      return document.createElement('sub');
    } else {
      return super.create(value);
    }
  }

  static formats(domNode) {
    let formats = {};
    if (domNode.tagName === 'SUB') {
      formats['script'] = 'sub';
    } else if (domNode.tagName === 'SUP') {
      formats['script'] = 'super';
    }
    return formats;
  }
}
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];

export default Script;
