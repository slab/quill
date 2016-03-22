import Block from '../blots/block';


class Header extends Block {
  formats() {
    let format = super.formats();
    format.header = Header.tagName.indexOf(this.domNode.tagName) + 1;
    return format;
  }

  optimize(mutations) {
    super.optimize(mutations);
    let text = this.domNode.innerText.toLowerCase();
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
