import Parchment from 'parchment';
import Container from './container';
import Block, { BlockEmbed } from './block';


class ContainBlot extends Container {

  static randomId() {
    return Math.random().toString(36).slice(2)
  }

  static create(value) {
    let tagName = 'contain';
    let node = super.create(tagName);
    if(value == true) {
      value = this.randomId();
    }
    node.setAttribute('id', value);
    return node;
  }

  insertBefore(blot, ref) {
    if (blot.statics.blotName == this.statics.blotName) {
      // console.log('############################ Not sure this is clean:') // eslint-disable-line
      // console.log(blot) // eslint-disable-line
      // console.log(blot.children.head) // eslint-disable-line
      super.insertBefore(blot.children.head, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }

  static formats(domNode) {
    return domNode.getAttribute('id');
  }

  formats() {
    // We don't inherit from FormatBlot
    return { [this.statics.blotName]: this.statics.formats(this.domNode) }
  }

  replace(target) {
    if (target.statics.blotName !== this.statics.blotName) {
      let item = Parchment.create(this.statics.defaultChild);
      target.moveChildren(item);
      this.appendChild(item);
    }
    if (target.parent == null) return;
    super.replace(target)
  }

}

ContainBlot.blotName = 'contain';
ContainBlot.tagName = 'contain';
ContainBlot.scope = Parchment.Scope.BLOCK_BLOT;
ContainBlot.defaultChild = 'block';
ContainBlot.allowedChildren = [Block, BlockEmbed, Container];


export default ContainBlot;
