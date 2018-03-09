import Block from '../blots/block';
import Container from '../blots/container';

class ListItem extends Block {
  static create(value) {
    const node = super.create();
    node.setAttribute('data-list', value);
    return node;
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

ListContainer.defaultChild = ListItem;
ListContainer.allowedChildren = [ListItem];
ListItem.requiredParent = ListContainer;

export { ListContainer, ListItem as default };
