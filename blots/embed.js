import Parchment from 'parchment';
import TextBlot from './text';

const GUARD_TEXT = "\uFEFF";


class Embed extends Parchment.Embed { }


class InlineEmbed extends Embed {
  constructor(node) {
    super(node);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('contenteditable', false);
    [].slice.call(this.domNode.childNodes).forEach(function(childNode) {
      wrapper.appendChild(childNode);
    });
    this.leftGuard = document.createTextNode(GUARD_TEXT);
    this.rightGuard = document.createTextNode(GUARD_TEXT);
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(wrapper);
    this.domNode.appendChild(this.rightGuard);
  }

  index(node, offset) {
    if (node === this.leftGuard) return 0;
    if (node === this.rightGuard) return 1;
    return super.index(node, offset);
  }

  restore(node) {
    let range, text, textNode;
    if (node === this.leftGuard) {
      text = this.leftGuard.data.split(GUARD_TEXT).join('');
      if (this.prev instanceof TextBlot) {
        this.prev.insertAt(this.prev.length(), text);
        range = {
          startNode: this.prev.domNode,
          startOffset: this.prev.domNode.data.length
        };
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(Parchment.create(textNode), this);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
      this.leftGuard.data = GUARD_TEXT;
    } else if (node === this.rightGuard) {
      text = this.rightGuard.data.split(GUARD_TEXT).join('');
      if (this.next instanceof TextBlot) {
        this.next.insertAt(0, text);
        range = {
          startNode: this.next.domNode,
          startOffset: text.length
        }
      } else {
        textNode = document.createTextNode(text);
        this.parent.insertBefore(Parchment.create(textNode), this.next);
        range = {
          startNode: textNode,
          startOffset: text.length
        };
      }
      this.rightGuard.data = GUARD_TEXT;
    }
    return range;
  }

  update(mutations, context) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' &&
          (mutation.target === this.leftGuard || mutation.target === this.rightGuard)) {
        let range = this.restore(mutation.target);
        if (range) context.range = range;
      }
    });
  }
}


export { Embed as default, InlineEmbed };
