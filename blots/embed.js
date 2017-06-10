import Parchment from 'parchment';


class Embed extends Parchment.Embed { }


class InlineEmbed extends Embed {
  constructor(node) {
    super(node);
    const wrapper = document.createElement('span');
    wrapper.setAttribute('contenteditable', false);
    [].slice.call(this.domNode.childNodes).forEach(function(childNode) {
      wrapper.appendChild(childNode);
    });
    this.leftGuard = document.createTextNode("\uFEFF");
    this.rightGuard = document.createTextNode("\uFEFF");
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(wrapper);
    this.domNode.appendChild(this.rightGuard);
  }

  index(node, offset) {
    if (node === this.leftGuard) return 0;
    if (node === this.rightGuard) return 1;
    return super.index(node, offset);
  }
}


export { Embed as default, InlineEmbed };
