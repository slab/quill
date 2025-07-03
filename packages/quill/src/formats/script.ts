import Inline from '../blots/inline.js';

class Script extends Inline {
  static blotName = 'script';
  static tagName = ['SUB', 'SUP'];

  static create(value: 'super' | 'sub' | (string & {})) {
    if (value === 'super') {
      // Use the standard parchment creation which will use the proper document context
      const node = super.create(value) as HTMLElement;
      // Override the tag name to ensure we get the correct element
      if (node.tagName !== 'SUP') {
        const supElement = node.ownerDocument.createElement('sup');
        // Copy any attributes that might have been set
        Array.from(node.attributes).forEach((attr) => {
          supElement.setAttribute(attr.name, attr.value);
        });
        // Copy any existing content
        supElement.innerHTML = node.innerHTML;
        return supElement;
      }
      return node;
    }
    if (value === 'sub') {
      // Use the standard parchment creation which will use the proper document context
      const node = super.create(value) as HTMLElement;
      // Override the tag name to ensure we get the correct element
      if (node.tagName !== 'SUB') {
        const subElement = node.ownerDocument.createElement('sub');
        // Copy any attributes that might have been set
        Array.from(node.attributes).forEach((attr) => {
          subElement.setAttribute(attr.name, attr.value);
        });
        // Copy any existing content
        subElement.innerHTML = node.innerHTML;
        return subElement;
      }
      return node;
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
