import Block from '../blots/block';
import Delta from 'rich-text/lib/delta';
import Parchment from 'parchment';


class CodeBlock extends Block {
  constructor(value) {
    super(value);
    if (typeof value === 'string') {
      this.domNode.setAttribute('data-language', value)
    }
  }

  build() {
    this.domNode.innerHTML = this.domNode.innerText;
    hljs.highlightBlock(this.domNode);
  }

  deleteAt(index, length) {
    let text = this.domNode.innerText;
    this.domNode.innerText = text.slice(0, index) + text.slice(index + length);
    hljs.highlightBlock(this.domNode);
  }

  findNode() {
    return [this.domNode, 0]
  }

  findOffset() {

  }

  format(name, value) {

  }

  formatAt(index, length, name, value) {

  }

  getFormat() {
    return {
      'code-block': this.domNode.getAttribute('data-language') || true
    };
  }

  getLength() {
    return this.getValue().length;
  }

  getValue() {
    return this.domNode.innerText + '\n';
  }

  insertAt(index, value, def) {
    if (def != null || typeof value !== 'string') return;
    let text = this.domNode.innerText;
    this.domNode.innerText = text.slice(0, index) + value + text.slice(index);
    hljs.highlightBlock(this.domNode);
  }

  insertBefore(blot, ref) {
    let values = blot.getValue();
    if (!Array.isArray(values)) values = [values];
    let text = values.map(function(value) {
      return (typeof value === 'string') ? value : '';
    }).join('');
    this.insertAt(this.getLength() - 1, text);
  }

  update(mutation) {

  }
}
CodeBlock.blotName = 'code-block';
CodeBlock.tagName = 'PRE';


Parchment.register(CodeBlock);

export { CodeBlock as default };
