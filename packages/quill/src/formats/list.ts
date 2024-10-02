import Block from '../blots/block.js';
import Container from '../blots/container.js';
import type Scroll from '../blots/scroll.js';
import Quill from '../core/quill.js';

class ListContainer extends Container {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = ['OL', 'UL']; // Support both ordered and unordered lists

class ListItem extends Block {
  static create(value: string) {
    const node = super.create() as HTMLElement;
    node.setAttribute('data-list', value);
    return node;
  }

  static formats(domNode: HTMLElement) {
    // Handle more formats for list types: ordered, unordered, checked, unchecked
    const format = domNode.getAttribute('data-list') || '';
    return ['ordered', 'bullet', 'checked', 'unchecked'].includes(format)
      ? format
      : undefined;
  }

  static register() {
    Quill.register(ListContainer);
  }

  constructor(scroll: Scroll, domNode: HTMLElement) {
    super(scroll, domNode);
    const format = this.statics.formats(domNode);

    // Create UI for checkbox if the list format is checked or unchecked
    if (['checked', 'unchecked'].includes(format)) {
      const ui = domNode.ownerDocument.createElement('span');
      ui.classList.add('list-ui'); // Add a CSS class for styling

      const listEventHandler = (e: Event) => {
        if (!scroll.isEnabled()) return;

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
  }

  format(name: string, value: string) {
    // Extend format handling to include more list types
    if (name === this.statics.blotName && value) {
      if (['ordered', 'bullet', 'checked', 'unchecked'].includes(value)) {
        this.domNode.setAttribute('data-list', value);
      }
    } else {
      super.format(name, value);
    }
  }
}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

// Allow both ordered (OL) and unordered (UL) containers
ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

export { ListContainer, ListItem as default };
