import Block from '../blots/block.js';
import Container from '../blots/container.js';
import Quill from '../core/quill.js';
class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';
class ListItem extends Block {
  static create(value) {
    const node = super.create();
    node.setAttribute('data-list', value);
    return node;
  }
  static formats(domNode) {
    return domNode.getAttribute('data-list') || undefined;
  }
  static register() {
    Quill.register(ListContainer);
  }
  constructor(scroll, domNode) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement('span');
    const listEventHandler = e => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      if (format === 'checked') {
        this.format('list', 'unchecked');
        e.preventDefault();
      } else if (format === 'unchecked') {
        this.format('list', 'checked');
        e.preventDefault();
      }
    };
    ui.addEventListener('mousedown', listEventHandler);
    ui.addEventListener('touchstart', listEventHandler);
    this.attachUI(ui);
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
ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;
export { ListContainer, ListItem as default };
//# sourceMappingURL=list.js.map