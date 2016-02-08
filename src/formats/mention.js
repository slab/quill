import Embed from '../embed';


// Only works for 2 word names
class Mention extends Embed {
  constructor(domNode) {
    super(domNode);
    this.textNode = this.domNode.firstChild;
  }

  deleteAt(index, length) {
    let space = this.textNode.data.indexOf(' ');
    if (space === -1 || (index === 0 && length >= 2)) {
      this.remove();
    } else if (space < index) {
      this.textNode.data = this.textNode.data.slice(0, space + 1);
    } else {
      this.textNode.data = this.textNode.data.slice(space + 1);
    }
  }

  format(name, value) {
    if (name === 'data-id') {
      this.domNode.setAttribute('data-id', value);
    }
  }

  index(node, offset) {
    if (node === this.textNode) {
      let space = this.textNode.data.indexOf(' ');
      return (-1 < space && space < offset) ? 0 : 1;
    }
    return super.index(node, offset);
  }

  length() {
    return this.textNode.data.split(' ').length;
  }

  position(index, inclusive) {
    let space = this.textNode.data.indexOf(' ');
    if (space === -1 || index === 0) {
      return [this.textNode, index];
    } else if (index < space || (index <= space && inclusive)) {
      return [this.textNode, space];
    } else {
      return [this.textNode, this.textNode.data.length];
    }
  }

  value() {
    return {
      name: this.textNode.data,
      id: this.domNode.getAttribute('data-id')
    }
  }
}
Mention.create = function(value) {
  let node = Embed.prototype.create.call(Mention, value);
  node.setAttribute('data-id', value.id);
  node.setAttribute('title', value.name);
  node.setAttribute('href', '/users/' + value.id);
  node.appendChild(document.createTextNode(value.name));
  return node;
};
Mention.blotName = 'mention';
Mention.className = 'mention';
Mention.tagName = 'A';


export default Mention;
