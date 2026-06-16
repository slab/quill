import Block from '../blots/block.js';
class Header extends Block {
  static blotName = 'header';
  static tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  static formats(domNode) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  }
}
export default Header;
//# sourceMappingURL=header.js.map