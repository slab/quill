import Block from '../blots/block';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Header extends Block {
  constructor(value) {
    if (typeof value === 'number') {
      value = document.createElement(Header.tagName[value - 1]);
    }
    super(value);
  }

  getFormat() {
    let formats = super.getFormat();
    formats.header = Header.tagName.indexOf(this.domNode.tagName) + 1;
    return formats;
  }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3'];


Parchment.register(Header);

export { Header as default };
