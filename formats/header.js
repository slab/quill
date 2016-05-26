import Block from '../blots/block';


class Header extends Block {
  static formats(domNode) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];


export default Header;
