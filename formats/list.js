import Block from '../blots/block';
import Container from '../blots/container';

class ListItem extends Block {
  static create(value) {
    const node = super.create();
    node.setAttribute('data-list', value);
    return node;
  }

  static formats(domNode) {
    return domNode.getAttribute('data-list') || undefined;
  }

  constructor(domNode) {
    super(domNode);
    const listEventHandler = e => {
      if (e.target !== domNode) return;
      const format = this.statics.formats(domNode);
      if (format === 'checked') {
        this.format('list', 'unchecked');
      } else if (format === 'unchecked') {
        this.format('list', 'checked');
      }
    };
    domNode.addEventListener('touchstart', listEventHandler);
    domNode.addEventListener('mousedown', listEventHandler);
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('data-list', value);
    } else {
      super.format(name, value);
    }
  }
}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

export { ListContainer, ListItem as default };
