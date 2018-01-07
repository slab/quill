import Embed from '../blots/embed';

class Mention extends Embed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('data-id', value);
    node.setAttribute('href', `/${value}`);
    node.textContent = '@quilljs';
    return node;
  }

  static value(domNode) {
    return domNode.getAttribute('data-id');
  }
}
Mention.blotName = 'mention';
Mention.className = 'ql-mention';
Mention.tagName = 'A';

export default Mention;
