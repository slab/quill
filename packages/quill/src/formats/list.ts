import Block from '../blots/block.js';
import Container from '../blots/container.js';
import Scroll from '../blots/scroll.js';
import Quill from '../core/quill.js';
import { getSubscriber, Subscriber } from '../core/subscriber.js';

class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';

class ListItem extends Block {
  static create(value: string) {
    const node = super.create() as HTMLElement;
    node.setAttribute('data-list', value);
    return node;
  }

  static formats(domNode: HTMLElement) {
    return domNode.getAttribute('data-list') || undefined;
  }

  static register() {
    Quill.register(ListContainer);
  }

  subscriber: Subscriber;

  constructor(scroll: Scroll, domNode: HTMLElement) {
    super(scroll, domNode);
    this.subscriber = getSubscriber(this.scroll.domNode);
    const ui = domNode.ownerDocument.createElement('span');
    const listEventHandler = (e: Event) => {
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
    this.subscriber.on(this, ui, 'mousedown', listEventHandler);
    this.subscriber.on(this, ui, 'touchstart', listEventHandler);
    this.attachUI(ui);
  }

  detach() {
    super.detach();
    this.subscriber.removeSourceListeners(this);
  }

  format(name: string, value: string) {
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
