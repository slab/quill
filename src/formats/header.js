import Block from '../blots/block';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class Header extends Block {
  formats() {
    let format = super.formats();
    format.header = Header.tagName.indexOf(this.domNode.tagName) + 1;
    return format;
  }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];


export default Header;
