import Parchment from 'parchment';
import Block from '../blots/block';
import Container from '../blots/container';

const LIST_BLOT = 'list';

class ListItem extends Block {
  static formats(domNode) {
    return domNode.tagName === this.tagName
      ? undefined
      : super.formats(domNode);
  }

  format(name, value) {
    if (name === LIST_BLOT && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);
    }
  }

  remove() {
    if (this.prev == null && this.next == null) {
      this.parent.remove();
    } else {
      super.remove();
    }
  }

  replaceWith(name, value) {
    this.parent.isolate(this.offset(this.parent), this.length());
    if (name === this.parent.statics.blotName) {
      this.parent.replaceWith(name, value);
      return this;
    }
    this.parent.unwrap();
    return super.replaceWith(name, value);
  }
}
ListItem.blotName = 'list-item';
ListItem.tagName = 'LI';

class List extends Container {
  static create(value) {
    const tagName = value === 'ordered' ? 'OL' : 'UL';
    const node = super.create(tagName);
    if (value === 'checked' || value === 'unchecked') {
      node.setAttribute('data-checked', value === 'checked');
    }
    return node;
  }

  static formats(domNode) {
    if (domNode.tagName === 'OL') return 'ordered';
    if (domNode.tagName === 'UL') {
      if (domNode.hasAttribute('data-checked')) {
        return domNode.getAttribute('data-checked') === 'true'
          ? 'checked'
          : 'unchecked';
      }
      return 'bullet';
    }
    return undefined;
  }

  constructor(domNode) {
    super(domNode);
    const listEventHandler = e => {
      if (e.target.parentNode !== domNode) return;
      const format = this.statics.formats(domNode);
      const blot = Parchment.find(e.target);
      if (format === 'checked') {
        blot.format('list', 'unchecked');
      } else if (format === 'unchecked') {
        blot.format('list', 'checked');
      }
    };

    domNode.addEventListener('touchstart', listEventHandler);
    domNode.addEventListener('mousedown', listEventHandler);
  }

  format(name, value) {
    if (this.children.length > 0) {
      this.children.tail.format(name, value);
    }
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]: this.statics.formats(this.domNode) };
  }

  insertBefore(blot, ref) {
    if (blot instanceof ListItem) {
      super.insertBefore(blot, ref);
    } else {
      const index = ref == null ? this.length() : ref.offset(this);
      const after = this.split(index);
      after.parent.insertBefore(blot, after);
    }
  }

  optimize(context) {
    super.optimize(context);
    const { next } = this;
    if (
      next != null &&
      next.prev === this &&
      next.statics.blotName === this.statics.blotName &&
      next.domNode.tagName === this.domNode.tagName &&
      next.domNode.getAttribute('data-checked') ===
        this.domNode.getAttribute('data-checked')
    ) {
      next.moveChildren(this);
      next.remove();
    }
  }

  replace(target) {
    if (target.statics.blotName !== this.statics.blotName) {
      const item = Parchment.create(this.statics.defaultChild);
      target.moveChildren(item);
      this.appendChild(item);
    }
    super.replace(target);
  }
}
List.blotName = LIST_BLOT;
List.scope = Parchment.Scope.BLOCK_BLOT;
List.tagName = ['OL', 'UL'];
List.defaultChild = 'list-item';
List.allowedChildren = [ListItem];

export { ListItem, List as default };
