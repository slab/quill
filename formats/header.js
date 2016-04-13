import Block from 'quill/blots/block';


class Header extends Block {
  static formats(domNode) {
    return this.tagName.indexOf(domNode.tagName) + 1;
  }

  optimize() {
    super.optimize();
    let text = this.domNode.textContent.toLowerCase();
    let id = text.replace(/[^a-z0-9]+/g, '-').replace(/^\-/, '').replace(/\-$/, '');
    if (this.domNode.id !== id) {
      if (id.length === 0) {
        this.domNode.removeAttribute('id');
      } else {
        this.domNode.id = id;
      }
    }
  }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];


export default Header;
