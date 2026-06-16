import Inline from '../blots/inline.js';
class Script extends Inline {
  static blotName = 'script';
  static tagName = ['SUB', 'SUP'];
  static create(value) {
    if (value === 'super') {
      return document.createElement('sup');
    }
    if (value === 'sub') {
      return document.createElement('sub');
    }
    return super.create(value);
  }
  static formats(domNode) {
    if (domNode.tagName === 'SUB') return 'sub';
    if (domNode.tagName === 'SUP') return 'super';
    return undefined;
  }
}
export default Script;
//# sourceMappingURL=script.js.map